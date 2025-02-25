// Imports.
import React, {useEffect, useContext, useRef} from "react";
import { useTranslation } from "react-i18next";
import globalContext from "../../src/context";
import PropTypes from 'prop-types';
import "bootstrap-icons/font/bootstrap-icons.css";


// The validated multiple choice input.
export const ValidatedMultipleChoice = (props) => {

    const { t } = useTranslation('bmt-template-components-validated-multiple-choice');

    // Get the global state and define the keys for accessing data in the global state.
    const { state, setState } = useContext(globalContext);
    const key = props.name;

    const keyValues = key + '_values';
    const keyPreviousValues = key + '_previous-values';
    const keyStatus = key + '_status';
    const keyRef = key + '_ref';
    const refValue = useRef(null);

    const keyShowAdditionalInformation = key + '_show-additional-information';
    const keyAdditionalInformationShown = key + '_additional-information-shown';
    const keyAdditionalInformationAvailable = key + '_additional-information-available';

    const keyShowSolutionInformation = key + '_show-solution-information';
    const keySolutionInformationShown = key + '_solution-information-shown';
    const keySolutionInformationAvailable = key + '_solution-information-available';

    const keyValidationErrorOccurred = key + '_validation-error-occurred';
    const keyNumberOfValidationErrors = key + '_number-of-validation-errors';

    const keyRequiredErrorOccurred = key + '_required-error-occurred';
    const keyNumberOfRequiredErrors = key + '_number-of-required-errors';
    const keyShowRequiredErrorMessage = key + '_show-required-error-message';
    const keyRequiredErrorMessageShown = key + '_required-error-message-shown';

    // Functions for handling interaction with the component.
    const toggleAdditionalInformation = () => {
        // Change global state.
        setState((prevState) => ({
            ...prevState,
            [keyShowAdditionalInformation]: !prevState[keyShowAdditionalInformation],
            [keyAdditionalInformationShown]: 1,
        }));
    };

    // Initial state values.
    useEffect(() => {
        setState((prevState) => ({
            ...prevState,
            [keyStatus]: prevState[keyStatus] ? prevState[keyStatus] : 0,
            [keyValues]: prevState[keyValues] ? prevState[keyValues] : [],
            [keyPreviousValues]: prevState[keyPreviousValues] ? prevState[keyPreviousValues] : [],
            [keyShowAdditionalInformation]: prevState[keyShowAdditionalInformation] ? prevState[keyShowAdditionalInformation] : false,
            [keyAdditionalInformationShown]: prevState[keyAdditionalInformationShown] ? prevState[keyAdditionalInformationShown] : 0,
            [keyAdditionalInformationAvailable]: (props.additionalInformationTitle !== undefined && props.additionalInformationTitle !== "") || (props.additionalInformationText !== undefined && props.additionalInformationText !== ""),
            [keyShowSolutionInformation]: prevState[keyShowSolutionInformation] ? prevState[keyShowSolutionInformation] : false,
            [keySolutionInformationShown]: prevState[keySolutionInformationShown] ? prevState[keySolutionInformationShown] : 0,
            [keySolutionInformationAvailable]: (props.solutionInformationTitle !== undefined && props.solutionInformationTitle !== "") || (props.solutionInformationText !== undefined && props.solutionInformationText !== ""),
            [keyValidationErrorOccurred]: prevState[keyValidationErrorOccurred] ? prevState[keyValidationErrorOccurred] : 0,
            [keyNumberOfValidationErrors]: prevState[keyNumberOfValidationErrors] ? prevState[keyNumberOfValidationErrors] : 0,
            [keyRequiredErrorOccurred]: prevState[keyRequiredErrorOccurred] ? prevState[keyRequiredErrorOccurred] : 0,
            [keyNumberOfRequiredErrors]: prevState[keyNumberOfRequiredErrors] ? prevState[keyNumberOfRequiredErrors] : 0,
            [keyShowRequiredErrorMessage]: prevState[keyShowRequiredErrorMessage] ? prevState[keyShowRequiredErrorMessage] : false,
            [keyRequiredErrorMessageShown]: prevState[keyRequiredErrorMessageShown] ? prevState[keyRequiredErrorMessageShown] : 0,
        }));
    }, []);

    useEffect(() => {
        setState((prevState) => ({
            ...prevState,
            [keyRef]: refValue,
        }));
    }, [refValue]);

    // Pass props to children.
    const renderChildren = () => {
        return React.Children.map(props.children, (child) => {
            return React.cloneElement(child, {
                name: props.name,
                required: props.required
            });
        });
    }

    // Return the component.
    return (
        <div className="my-4">
            <div className="mb-1">
                <span>
                    {props.label}
                </span>
                {
                    state[keyAdditionalInformationAvailable] &&
                    (
                        <button onClick={toggleAdditionalInformation} className="ml-2 text-xl text-gray-500 leading-[0]" type="button">
                            <i className="bi bi-info-circle align-middle"/>
                        </button>
                    )
                }
            </div>

            <div
                ref={refValue}
                className="ml-3">
                { renderChildren() }
            </div>

            {
                state[keyShowRequiredErrorMessage] &&
                (
                    <div className="ml-1 mt-1">
                        <span className="label-text-alt text-red-500">
                            { props.requiredErrorMessage || t("default-required-error-message") }
                        </span>
                    </div>
                )
            }

            {
                state[keyAdditionalInformationAvailable] && state[keyShowAdditionalInformation] &&
                (
                    <div className="ml-1 mt-1">
                        <div>
                            <strong>{ props.additionalInformationTitle || t("default-additional-information-title")}</strong>
                        </div>
                        {
                            props.additionalInformationText !== undefined && props.additionalInformationText !== "" &&
                            <div>
                                {props.additionalInformationText}
                            </div>
                        }
                    </div>
                )
            }

            {
                state[keySolutionInformationAvailable] && state[keyShowSolutionInformation] &&
                (
                    <div className="ml-1 mt-1">
                        <div>
                            <strong>{ props.solutionInformationTitle || t("default-solution-information-title")}</strong>
                        </div>
                        {
                            props.solutionInformationText !== undefined && props.solutionInformationText !== "" &&
                            <div>
                                {props.solutionInformationText}
                            </div>
                        }
                    </div>
                )
            }
        </div>
    );
};

// The validated multiple choice option.
export const ValidatedMultipleChoiceOption = (props) => {
    // Get the global state and define the keys for accessing data in the global state.
    const { state, setState } = useContext(globalContext);
    const key = props.name;

    const keyStatus = key + '_status';
    const keyValues = key  + '_values';
    const keyShowRequiredErrorMessage = key + '_show-required-error-message';

    // Function for handling interaction with the component.
    const handleInput = (e) => {
        let newList = [...state[keyValues]];

        // Check is the checkbox is activated or deactivated.
        const checkboxElem = e.target;
        if(checkboxElem.checked) {
            newList.push(props.value)
            setState((prevState) => ({
                ...prevState,
                [keyStatus]: 0,
                [keyValues]: newList,
                [keyShowRequiredErrorMessage]: false,
            }));
        } else {
            newList.splice(newList.indexOf(props.value), 1);
            setState((prevState) => ({
                ...prevState,
                [keyValues]: newList,
            }));
        }
    };

    // Return the component.
    return (
        <div className="w-full form-control">
            <label className="flex items-center cursor-pointer hover:text-gray-400">
                {
                    state[keyValues] !== undefined && Array.from(state[keyValues]).includes(props.value) &&
                    <input
                        type="checkbox"
                        name={props.name}
                        className={`checkbox checkbox-sm rounded ${
                            state[keyStatus] === 1 && Array.from(state[keyValues]).includes(props.value) ? "checkbox-success" : state[keyStatus] === -1 ? "checkbox-error" : ""
                        }`}
                        value={props.value}
                        onChange={handleInput}
                        required={props.required !== undefined ? props.required : false}
                        defaultChecked
                    />
                }
                {
                    state[keyValues] === undefined || !Array.from(state[keyValues]).includes(props.value) &&
                    <input
                        type="checkbox"
                        name={props.name}
                        className={`checkbox checkbox-sm rounded ${
                            state[keyStatus] === 1 && Array.from(state[keyValues]).includes(props.value) ? "checkbox-success" : state[keyStatus] === -1 ? "checkbox-error" : ""
                        }`}
                        value={props.value}
                        onChange={handleInput}
                        required={props.required !== undefined ? props.required : false}
                    />
                }
                <span className='ml-5 my-1'>
                    {props.children}
                </span>
            </label>
        </div>
    );
};

// Checking props.
ValidatedMultipleChoice.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    additionalInformationTitle: PropTypes.string,
    additionalInformationText: PropTypes.string,
    solutionInformationTitle: PropTypes.string,
    solutionInformationText: PropTypes.string,
    validationCallback: PropTypes.func.isRequired,
    required: PropTypes.bool,
    requiredErrorMessage: PropTypes.string
}

ValidatedMultipleChoiceOption.propTypes = {
    value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]).isRequired
}
