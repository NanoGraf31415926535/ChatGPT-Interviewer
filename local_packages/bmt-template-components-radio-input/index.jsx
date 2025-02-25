// Imports.
import React, {useEffect, useContext, useRef} from "react";
import { useTranslation } from "react-i18next";
import globalContext from "../../src/context";
import PropTypes from 'prop-types';

// The radio input.
export const RadioInput = (props) => {

    const { t } = useTranslation('bmt-template-components-radio-input');

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

    // Initial state values.
    useEffect(() => {
        setState((prevState) => ({
            ...prevState,
            [keyStatus]: prevState[keyStatus] !== undefined ? prevState[keyStatus] : 0,
            [keyValue]: prevState[keyValue] !== undefined ? prevState[keyValue] : "",
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
                            { props.requiredErrorMessage || t("default-required-error-message") }
                        </span>
                    </div>
                )
            }
        </div>
    );
};

// The radio option.
export const RadioInputOption = (props) => {
    // Get the global state and define the keys for accessing data in the global state.
    const { state, setState } = useContext(globalContext);
    const key = props.name;

    const keyStatus = key + '_status';
    const keyValue = key  + '_value';
    const keyShowRequiredErrorMessage = key + '_show-required-error-message';

    // Function for handling interaction with the component.
    const handleInput = () => {
        setState((prevState) => ({
            ...prevState,
            [keyStatus]: 0,
            [keyValue]: props.value,
            [keyShowRequiredErrorMessage]: false,
        }));
    };

    // Return the component.
    return (
        <div className="w-full form-control">
            <label className="flex items-center cursor-pointer hover:text-gray-400">
                {
                    state[keyValue] !== undefined && state[keyValue] === props.value &&
                    <input
                        type="radio"
                        name={props.name}
                        className={`radio radio-sm ${
                            state[keyStatus] === 1 && state[keyValue] === props.value ? "radio-success" : state[keyStatus] === -1 ? "radio-error" : ""
                        }`}
                        value={props.value}
                        onInput={handleInput}
                        required={props.required !== undefined ? props.required : false}
                        defaultChecked
                    />
                }
                {
                    state[keyValue] === undefined || state[keyValue] !== props.value &&
                    <input
                        type="radio"
                        name={props.name}
                        className={`radio radio-sm ${
                            state[keyStatus] === 1 && state[keyValue] === props.value ? "radio-success" : state[keyStatus] === -1 ? "radio-error" : ""
                        }`}
                        value={props.value}
                        onInput={handleInput}
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
RadioInput.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    required: PropTypes.bool,
    requiredErrorMessage: PropTypes.string
}

RadioInputOption.propTypes = {
    value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]).isRequired
}
