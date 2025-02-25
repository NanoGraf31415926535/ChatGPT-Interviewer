// Imports.
import React, {useEffect, useContext, useRef} from "react";
import globalContext from "../../src/context";
import PropTypes from 'prop-types';

// The slider.
const Slider = (props) => {
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

    const marks = Number(props.max / props.step);

    // Functions for handling interaction with the component.
    const handleInput = (e) => {
        const rangeElem = e.target;
        const currentValue = rangeElem.value;

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

            <div className="w-full md:w-1/2 xxl:w-1/4 form-control">
                <input
                    ref={refValue}
                    type="range"
                    min={props.min}
                    max={props.max}
                    step={props.step}
                    name={props.name}
                    className={`range range-sm ${
                        state[keyStatus] === 1 ? "range-success" : state[keyStatus] === -1 ? "range-error" : ""
                    }`}
                    onInput={handleInput}
                    required={props.required !== undefined ? props.required : false}
                    defaultValue={state[keyValue] !== undefined ? state[keyValue] : (props.defaultValue ?? "")}
                />
                {
                    props.showMarks !== undefined && props.showMarks &&
                    (
                        <div className="w-full flex justify-between text-xs px-2">
                            {
                                [...Array(marks + 1)].map((_, index) => {
                                    return (
                                        <div className="flex flex-col justify-center items-center gap-2 text-md" key={index}>
                                            <span>|</span>
                                            <span>{props.min + index * props.step}</span>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    )
                }
            </div>

            {
                props.requiredErrorMessage !== undefined && props.requiredErrorMessage !== "" && state[keyShowRequiredErrorMessage] &&
                (
                    <div className="ml-1 mt-1">
                        <span className="label-text-alt text-red-500">{props.requiredErrorMessage}</span>
                    </div>
                )
            }
        </div>
    );
};

// Checking props.
Slider.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    step: PropTypes.number.isRequired,
    defaultValue: PropTypes.number,
    required: PropTypes.bool,
    requiredErrorMessage: PropTypes.string,
    showMarks: PropTypes.bool
}

// Export.
export default Slider;
