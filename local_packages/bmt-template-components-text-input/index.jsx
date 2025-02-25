// Imports.
import React, { useEffect, useContext, useRef } from "react";
import { useTranslation } from "react-i18next";
import globalContext from "../../src/context";
import PropTypes from 'prop-types';

// The component.
const TextInput = (props) => {

    const { t } = useTranslation('bmt-template-components-text-input');

    // Get the global state and define the keys for accessing data in the global state.
    const { state, setState } = useContext(globalContext);
    const key = props.name;

    const keyValue = key + '_value';
    const keyStatus = key + '_status';
    const keyRef = key + '_ref';
    const refValue = useRef(null);

    const keyPatternErrorOccurred = key + '_pattern-error-occurred';
    const keyNumberOfPatternErrors = key + '_number-of-pattern-errors';
    const keyShowPatternErrorMessage = key + '_show-pattern-error-message';
    const keyPatternErrorMessageShown = key + '_pattern-error-message-shown';

    const keyRequiredErrorOccurred = key + '_required-error-occurred';
    const keyNumberOfRequiredErrors = key + '_number-of-required-errors';
    const keyShowRequiredErrorMessage = key + '_show-required-error-message';
    const keyRequiredErrorMessageShown = key + '_required-error-message-shown';

    // Functions for handling interaction with the component.
    const onInput = () => {
        // Change global state to hide the pattern error message (if visible).
        setState((prevState) => ({
            ...prevState,
            [keyStatus]: 0,
            [keyShowPatternErrorMessage]: false,
            [keyShowRequiredErrorMessage]: false
        }));
    };

    const onBlur = (e) => {
        // Get the value.
        const inputElem = e.target;
        const currentValue = inputElem.value;

        // Check if the input matches the pattern (if existent).
        if (props.pattern !== undefined && props.pattern !== "") {
            // Validate.
            const regExpObject = new RegExp(props.pattern);

            // Set/Remove error class.
            if (regExpObject.test(currentValue)) {
                // Add to the global state.
                setState((prevState) => ({
                    ...prevState,
                    [keyValue]: currentValue,
                    [keyStatus]: 0
                }));
            } else {
                // Remove value from global state and set the error flag
                setState((prevState) => ({
                    ...prevState,
                    [keyValue]: "",
                    [keyStatus]: -1,
                    [keyPatternErrorOccurred]: 1,
                    [keyNumberOfPatternErrors]: prevState[keyNumberOfPatternErrors] + 1,
                    [keyShowPatternErrorMessage]: true,
                    [keyPatternErrorMessageShown]: 1,
                }));
            }
        } else {
            // Add to the global state.
            setState((prevState) => ({
                ...prevState,
                [keyValue]: currentValue,
                [keyStatus]: 0,
            }));
        }
    };

    // Initial state values.
    useEffect(() => {
        // Add to the global state.
        setState((prevState) => ({
            ...prevState,
            [keyStatus]: prevState[keyStatus] !== undefined ? prevState[keyStatus] : 0,
            [keyValue]: prevState[keyValue] !== undefined ? prevState[keyValue] : "",
            [keyPatternErrorOccurred]: prevState[keyPatternErrorOccurred] !== undefined ? prevState[keyPatternErrorOccurred] : 0,
            [keyNumberOfPatternErrors]: prevState[keyNumberOfPatternErrors] !== undefined ? prevState[keyNumberOfPatternErrors] : 0,
            [keyShowPatternErrorMessage]: prevState[keyShowPatternErrorMessage] !== undefined ? prevState[keyShowPatternErrorMessage] : false,
            [keyPatternErrorMessageShown]: prevState[keyPatternErrorMessageShown] !== undefined ? prevState[keyPatternErrorMessageShown] : 0,
            [keyRequiredErrorOccurred]: prevState[keyRequiredErrorOccurred] !== undefined ? prevState[keyRequiredErrorOccurred] : 0,
            [keyNumberOfRequiredErrors]: prevState[keyNumberOfRequiredErrors] !== undefined ? prevState[keyNumberOfRequiredErrors] : 0,
            [keyShowRequiredErrorMessage]: prevState[keyShowRequiredErrorMessage] !== undefined ? prevState[keyShowRequiredErrorMessage] : false,
            [keyRequiredErrorMessageShown]: prevState[keyRequiredErrorMessageShown] !== undefined ? prevState[keyRequiredErrorMessageShown] : 0,
        }));
    }, []);

    useEffect(() => {
        setState((prevState) => ({
            ...prevState,
            [keyRef]: refValue,
        }));
    }, [refValue]);

    // Return the component.
    return (
        <div className="my-4">
            <div className="mb-1">
                {props.label}
            </div>

            <div className="w-full">
                <input
                    ref={refValue}
                    type="text"
                    name={props.name}
                    className={`input input-bordered w-full ${
                        state[keyStatus] === 1 ? "input-success" : state[keyStatus] === -1 ? "input-error" : ""
                    }`}
                    placeholder={
                        props.placeholder !== undefined ? props.placeholder : t("default-placeholder")
                    }
                    onInput={onInput}
                    onBlur={onBlur}
                    required={props.required !== undefined ? props.required : false}
                    defaultValue={state[keyValue] !== undefined ? state[keyValue] : ""}
                />
            </div>

            {
                state[keyShowPatternErrorMessage] &&
                (
                    <div className="ml-1 mt-1">
                        <span className="label-text-alt text-red-500">
                            { props.patternErrorMessage || t("default-pattern-error-message") }
                        </span>
                    </div>
                )
            }

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
        </div>
    );
};

// Checking props.
TextInput.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    pattern: PropTypes.string,
    patternErrorMessage: PropTypes.string,
    required: PropTypes.bool,
    requiredErrorMessage: PropTypes.string,
}

// Export.
export default TextInput;
