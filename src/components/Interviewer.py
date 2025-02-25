from flask import Flask, request, jsonify, send_file
import openai
import json
import re
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)
# Load API key and configuration
openai.api_key = ""

with open("src/components/config.json", "r") as file:
    CONFIG = json.load(file)

# Global state variables
MESSAGES = CONFIG["messages"]
TOPICS = CONFIG["topics"]

conversation_history = []
interview_started = False
topic_index = 0
question_count = 0
last_invalid_response = ""
agents_log = []

AGENTS_WORK_LOG_FILE = "src/components/agents_work_log.txt"
SUMMARY_LOG_FILE = "src/components/summary_log.txt"

log_file_initialized = False  
summary_file_initialized = False  
reflection_phase_started = False
reflection_question_1_asked = False
reflection_question_2_asked = False

def log_agent_work(entry):
    global log_file_initialized
    os.makedirs(os.path.dirname(AGENTS_WORK_LOG_FILE), exist_ok=True)
    
    if not log_file_initialized:
        with open(AGENTS_WORK_LOG_FILE, "w") as file:
            file.write(MESSAGES.get("agents_work_log_header", "Agents Work Log Initialized\n"))
        log_file_initialized = True
    
    with open(AGENTS_WORK_LOG_FILE, "a") as file:
        file.write(entry + "\n")


def update_summary_log(summary):
    global summary_file_initialized
    os.makedirs(os.path.dirname(SUMMARY_LOG_FILE), exist_ok=True)
    
    if not summary_file_initialized:
        with open(SUMMARY_LOG_FILE, "w") as file:  
            file.write("Summary Log Initialized\n")
        summary_file_initialized = True

    with open(SUMMARY_LOG_FILE, "a") as file:
        file.write(f"Summary Updated:\n{summary}\n")
    log_agent_work(f"Summary Agent Updated Summary:\n{summary}")

def format_conversation_history(history):
    return "\n".join([f"{msg['role'].capitalize()}: {msg['content']}" for msg in history])


def probing_agent(summary, current_topic, current_topic_history):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4-0613",
            temperature=0.7,
            n=1,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0,
            stream=False,
            messages=[
                {
                    "role": "system", 
                    "content": (
                        "You are an interviewer. Your task is to engage in a natural, in-depth conversation by probing further into the interviewee's responses. "
                        "First, briefly rephrase the interviewee's last response to show understanding, then ask a related follow-up question. "
                        "Keep your rephrasing concise (1 sentence) and ensure your follow-up question directly builds on the rephrased statement."
                    )
                },
                {
                    "role": "user", 
                    "content": (
                        f"Previous Conversation Summary: {summary}\n"
                        f"Current Interview Topic: {current_topic}\n"
                        f"Current Conversation: {current_topic_history}\n"
                        f"Rephrase the interviewee's latest response briefly and then ask a probing question based on it."
                    )
                }
            ]
        )
        result = response['choices'][0]['message']['content']
        log_agent_work(f"Probing Agent Response: {result}")
        return result
    except Exception as e:
        log_agent_work(f"Error querying Probing Agent: {e}")
        return MESSAGES["error_generating_question"]

def topic_agent(summary, current_topic_history, next_interview_topic):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4-0314",
            temperature=0.7,
            n=1,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0,
            stream=False,
            messages=[
                {"role": "system", "content": "You're an AI guiding a qualitative interview. Your task is to introduce the next interview topic naturally, using elements from the previous conversation for a smooth transition."},
                {"role": "user", "content": f"Previous Conversation Summary: {summary}\nCurrent Conversation: {current_topic_history}\nNext Interview Topic: {next_interview_topic}\nProvide a natural transition question leading into the next topic."}
            ]
        )
        result = response['choices'][0]['message']['content']
        log_agent_work(f"Topic Agent Transition Question: {result}")
        return result
    except Exception as e:
        log_agent_work(f"Error querying Topic Agent: {e}")
        return MESSAGES["error_generating_question"]

def ask_next_question():
    global topic_index, question_count, reflection_phase_started, reflection_question_1_asked, reflection_question_2_asked

    summary = "\n".join([f"{msg['role'].capitalize()}: {msg['content']}" for msg in conversation_history])
    current_topic = TOPICS[topic_index] if topic_index < len(TOPICS) else ""
    current_topic_history = "\n".join([msg['content'] for msg in conversation_history if msg['role'] == "user"])

    if topic_index >= len(TOPICS):
        if not reflection_phase_started:
            reflection_phase_started = True

        if not reflection_question_1_asked:
            reflection_question_1_asked = True
            return MESSAGES["reflection_question_1"]

        if not reflection_question_2_asked:
            reflection_question_2_asked = True
            return MESSAGES["reflection_question_2"]

        return MESSAGES["end_of_interview"]

    question_limits = CONFIG.get("question_limits", [])
    if topic_index < len(question_limits) and question_count < question_limits[topic_index]:
        return probing_agent(summary, current_topic, current_topic_history)
    else:
        topic_index += 1
        question_count = 1
        if topic_index < len(TOPICS):
            next_topic = TOPICS[topic_index]
            return topic_agent(summary, current_topic_history, next_topic)
        else:
            return ask_next_question()

def moderate_message(user_message):
    try:
        response = openai.Moderation.create(input=user_message)
        moderation_result = response['results'][0]

        if moderation_result["flagged"]:
            log_agent_work(f"Message flagged: {user_message}")
            return False, MESSAGES["offensive_content"]

        rude_keywords = {"idiot", "shut up", "moron"}
        if any(word in user_message.lower() for word in rude_keywords):
            log_agent_work(f"Rude message detected: {user_message}")
            return False, MESSAGES["rude_language"]

        if len(user_message.strip()) < 3 or not re.search(r'\b\w+\b', user_message):
            log_agent_work(f"Nonsensical input detected: {user_message}")
            return False, MESSAGES["nonsensical_input"]

        return True, None
    except Exception as e:
        log_agent_work(f"Moderation check failed: {e}")
        return False, MESSAGES["moderation_error"]

def security_agent(last_question, user_answer):
    global last_invalid_response
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4-0613",
            temperature=0.7,
            n=1,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0,
            stream=False,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a sophisticated conversation monitor in an in-depth interview. "
                        "The interviewer asks questions, and the interviewee responds. "
                        "Your task is to assess the relevance and appropriateness of the interviewee's response."
                        "Consider these guidelines:"
                        "- **Relevance:** Does the response directly address the question, provide related information, or offer a reasonable explanation related to the topic?"
                        "- **Appropriateness:** Is the response respectful, non-harmful, and generally aligned with the interview context?"
                        "- **Allowances:** The interviewee may express uncertainty, state they don't know, or briefly digress to provide context. Personal anecdotes are acceptable if they are relevant."
                        "- **Variations:** Be tolerant of natural language variations, including slight grammatical errors and informal phrasing."
                        "Provide a detailed assessment of the response, explaining whether it is relevant and appropriate, and why. "
                        "If the response is irrelevant or inappropriate, specify the reason. If the response is fully relevant and appropriate, say 'Fully relevant and appropriate'. "
                        "If the response is only partially relevant, explain why and how."
                    )
                },
                {
                    "role": "user",
                    "content": (
                        f"Interviewer: '{last_question}'\n"
                        f"Interviewee: '{user_answer}'\n"
                        "Provide your detailed assessment."
                    )
                }
            ]
        )

        result = response['choices'][0]['message']['content'].strip()
        log_agent_work(f"Security Agent Explanation: {result}")

        if "Fully relevant and appropriate" in result:
            is_valid = True
        elif "partially relevant" in result.lower():
            is_valid = True # if the response is partially relevant, accept it.
        else:
            is_valid = False

        if not is_valid:
            if user_answer == last_invalid_response:
                return False, MESSAGES["repeated_nonsense"]
            last_invalid_response = user_answer

        log_agent_work(f"Security Agent Check: {is_valid}")
        return is_valid, None
    except Exception as e:
        log_agent_work(f"Security agent check failed: {str(e)}")
        return False, MESSAGES["moderation_error"]

def summarize_conversation():
    global current_summary
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4-0613",
            temperature=0.0,
            n=1,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0,
            stream=False,
            messages=[
                {"role": "system", "content": "You’re an AI proficient in summarizing qualitative interviews for academic research. You’re overseeing the records of a semi-structured qualitative interview about the interviewee’s reasons for not investing in the stock market. Do not be Thankful for summarizing the key points from the user's responses. Just give the summary."},
                {"role": "user", "content": "\n".join([f"{msg['role'].capitalize()}: {msg['content']}" for msg in conversation_history])}
            ]
        )
        current_summary = response['choices'][0]['message']['content']
        update_summary_log(current_summary)
        return current_summary
    except Exception as e:
        log_agent_work(f"Error summarizing conversation: {e}")
        return MESSAGES["error_summarizing"]


@app.route('/api/interview', methods=['POST'])
def interview():
    global conversation_history, interview_started, topic_index, question_count

    data = request.get_json()
    user_message = data.get("message")

    if not user_message:
        return jsonify({"error": MESSAGES["user_message_required"]}), 400

    if not interview_started:
        interview_started = True
        conversation_history.append({"role": "assistant", "content": MESSAGES["welcome"]})
        return jsonify({"response": MESSAGES["welcome"]})

    is_valid, error_message = moderate_message(user_message)
    
    if is_valid:
        last_question = conversation_history[-1]['content'] if conversation_history else ""
        is_relevant, security_message = security_agent(last_question, user_message)
        
        if is_relevant:
            conversation_history.append({"role": "user", "content": user_message})
            question_count += 1
            interviewer_message = ask_next_question()
        else:
            interviewer_message = security_message or MESSAGES["reanswer_prompt"]
    else:
        interviewer_message = error_message or MESSAGES["reanswer_prompt"]

    conversation_history.append({"role": "assistant", "content": interviewer_message})

    summarize_conversation()

    return jsonify({"response": interviewer_message})

@app.route('/api/summarize', methods=['POST'])
def summarize_chat():
    if not conversation_history:
        return jsonify({"error": MESSAGES["no_conversation_to_summarize"]}), 400

    try:
        summary = summarize_conversation()
        return jsonify({"summary": summary})
    except Exception as e:
        return jsonify({"error": f"{MESSAGES['error_summarizing']} {str(e)}"}), 500

@app.route('/api/download_agents_work', methods=['GET'])
def download_agents_work():
    try:
        if not os.path.exists(AGENTS_WORK_LOG_FILE):
            with open(AGENTS_WORK_LOG_FILE, "w") as file:
                file.write(MESSAGES["agents_work_log_header"])
        
        return send_file(AGENTS_WORK_LOG_FILE, as_attachment=True)
    except Exception as e:
        print(f"Error in /api/download_agents_work: {e}")
        return jsonify({"error": f"{MESSAGES['download_error']} {str(e)}"}), 500

@app.route('/api/download_summary', methods=['GET'])
def download_summary():
    try:
        if not os.path.exists(SUMMARY_LOG_FILE):
            with open(SUMMARY_LOG_FILE, "w") as file:
                file.write("Summary Log:\nNo summary available.")
        
        return send_file(SUMMARY_LOG_FILE, as_attachment=True)
    except Exception as e:
        print(f"Error in /api/download_summary: {e}")
        return jsonify({"error": f"{MESSAGES['download_error']} {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5001)