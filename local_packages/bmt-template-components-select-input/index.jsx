// Imports.
import React, {useEffect, useContext, useRef} from "react";
import { useTranslation } from "react-i18next";
import globalContext from "../../src/context";
import PropTypes from 'prop-types';

// The select input.
export const SelectInput = (props) => {

    const { t } = useTranslation('bmt-template-components-select-input');

    // Get the global state and define the keys for accessing data in the global state.
    const { state, setState } = useContext(globalContext);
    const key = props.name;

    const keyStatus = key + '_status';
    const keyValue = key + '_value';
    const keyRef = key + '_ref';
    const refValue = useRef(null);

    const keyRequiredErrorOccurred = key + '_required-error-occurred';
    const keyNumberOfRequiredErrors = key + '_number-of-required-errors';
    const keyShowRequiredErrorMessage = key + '_show-required-error-message';
    const keyRequiredErrorMessageShown = key + '_required-error-message-shown';

    // Functions for handling interaction with the component.
    const handleInput = (e) => {
        const selectElem = e.target;
        const currentValue = selectElem.value;

        if (currentValue === "") {
            setState((prevState) => ({
                ...prevState,
                [keyStatus]: 0,
                [keyValue]: "",
                [keyShowRequiredErrorMessage]: false,
            }));
        } else {
            setState((prevState) => ({
                ...prevState,
                [keyStatus]: 0,
                [keyValue]: currentValue,
                [keyShowRequiredErrorMessage]: false,
            }));
        }
    };

    // Initial state values.
    useEffect(() => {
        // Add to the global state.
        setState((prevState) => ({
            ...prevState,
            [keyStatus]: prevState[keyStatus] !== undefined ? prevState[keyStatus] : 0,
            [keyValue]: prevState[keyValue] !== undefined ? prevState[keyValue] : (props.defaultValue ?? ""),
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

            <div className="w-full form-control">
                <select
                    ref={refValue}
                    name={props.name}
                    className={`select select-bordered bg-gray-100 ${
                        state[keyStatus] === 1 ? "select-success" : state[keyStatus] === -1 ? "select-error" : ""
                    }`}
                    onInput={handleInput}
                    required={props.required !== undefined ? props.required : false}
                    defaultValue={state[keyValue] !== undefined ? state[keyValue] : (props.defaultValue ?? "")}
                >
                    <option value="" disabled>
                        {props.placeholder}
                    </option>
                    {props.children}
                </select>
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
        </div>
    );
};

// The select input option.
export const SelectInputOption = (props) => {
    return (
        <option value={props.value}>
            {props.children}
        </option>
    );
};

// Checking props.
SelectInput.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    defaultValue: PropTypes.number,
    required: PropTypes.bool,
    requiredErrorMessage: PropTypes.string,
}

SelectInputOption.propTypes = {
    value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]).isRequired
}
