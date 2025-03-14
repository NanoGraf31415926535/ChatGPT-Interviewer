// Imports.
import React, {useEffect, useContext, useRef} from "react";
import { useTranslation } from "react-i18next";
import globalContext from "../../src/context";
import PropTypes from 'prop-types';

// The multiple choice input.
export const MultipleChoice = (props) => {

    const { t } = useTranslation('bmt-template-components-multiple-choice');

    // Get the global state and define the keys for accessing data in the global state.
    const { state, setState } = useContext(globalContext);
    const key = props.name;

    const keyStatus = key + '_status';
    const keyValues = key + '_values';
    const keyRef = key + '_ref';
    const refValue = useRef(null);

    const keyRequiredErrorOccurred = key + '_required-error-occurred';
    const keyNumberOfRequiredErrors = key + '_number-of-required-errors';
    const keyShowRequiredErrorMessage = key + '_show-required-error-message';
    const keyRequiredErrorMessageShown = key + '_required-error-message-shown';

    // Initial state values.
    useEffect(() => {
        setState((prevState) => ({
            ...prevState,
            [keyStatus]: prevState[keyStatus] ? prevState[keyStatus] : 0,
            [keyValues]: prevState[keyValues] ? prevState[keyValues] : [],
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
                {props.label}
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
                            {props.requiredErrorMessage || t("default-required-error-message")}
                        </span>
                    </div>
                )
            }
        </div>
    );
};

// The multiple choice option.
export const MultipleChoiceOption = (props) => {
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
MultipleChoice.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    required: PropTypes.bool,
    requiredErrorMessage: PropTypes.string
}

MultipleChoiceOption.propTypes = {
    value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]).isRequired
}
