// Imports.
import React, {useEffect, useContext, useRef} from "react";
import { useTranslation } from "react-i18next";
import globalContext from "../../src/context";
import PropTypes from 'prop-types';
import "bootstrap-icons/font/bootstrap-icons.css";

// The validated slider.
const ValidatedSlider = (props) => {

    const { t } = useTranslation('bmt-template-components-validated-slider');

    // Get the global state and define the keys for accessing data in the global state.
    const { state, setState } = useContext(globalContext);
    const key = props.name;

    const keyValue = key + '_value';
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

    const marks = Number(props.max / props.step);

    // Functions for handling interaction with the component.
    const toggleAdditionalInformation = () => {
        // Change global state.
        setState((prevState) => ({
            ...prevState,
            [keyShowAdditionalInformation]: !prevState[keyShowAdditionalInformation],
            [keyAdditionalInformationShown]: 1,
        }));
    };

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
            [keyStatus]: prevState[keyStatus] !== undefined ? prevState[keyStatus]: 0,
            [keyValue]: prevState[keyValue] !== undefined ? prevState[keyValue]: (props.defaultValue ?? ""),
            [keyPreviousValues]: prevState[keyPreviousValues] !== undefined ? prevState[keyPreviousValues] : [],
            [keyShowAdditionalInformation]: prevState[keyShowAdditionalInformation] !== undefined ? prevState[keyShowAdditionalInformation]: false,
            [keyAdditionalInformationShown]: prevState[keyAdditionalInformationShown] !== undefined ? prevState[keyAdditionalInformationShown]: 0,
            [keyAdditionalInformationAvailable]: (props.additionalInformationTitle !== undefined && props.additionalInformationTitle !== "") || (props.additionalInformationText !== undefined && props.additionalInformationText !== ""),
            [keyShowSolutionInformation]: prevState[keyShowSolutionInformation] !== undefined ? prevState[keyShowSolutionInformation]: false,
            [keySolutionInformationShown]: prevState[keySolutionInformationShown] !== undefined ? prevState[keySolutionInformationShown]: 0,
            [keySolutionInformationAvailable]: (props.solutionInformationTitle !== undefined && props.solutionInformationTitle !== "") || (props.solutionInformationText !== undefined && props.solutionInformationText !== ""),
            [keyValidationErrorOccurred]: prevState[keyValidationErrorOccurred] !== undefined ? prevState[keyValidationErrorOccurred]: 0,
            [keyNumberOfValidationErrors]: prevState[keyNumberOfValidationErrors] !== undefined ? prevState[keyNumberOfValidationErrors]: 0,
            [keyRequiredErrorOccurred]: prevState[keyRequiredErrorOccurred] !== undefined ? prevState[keyRequiredErrorOccurred]: 0,
            [keyNumberOfRequiredErrors]: prevState[keyNumberOfRequiredErrors] !== undefined ? prevState[keyNumberOfRequiredErrors]: 0,
            [keyShowRequiredErrorMessage]: prevState[keyShowRequiredErrorMessage] !== undefined ? prevState[keyShowRequiredErrorMessage]: false,
            [keyRequiredErrorMessageShown]: prevState[keyRequiredErrorMessageShown] !== undefined ? prevState[keyRequiredErrorMessageShown]: 0,
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

            {
                state[keyAdditionalInformationAvailable] && state[keyShowAdditionalInformation] &&
                (
                    <div className="ml-1 mt-1">
                        {
                            props.additionalInformationTitle !== undefined && props.additionalInformationTitle !== "" &&
                            (
                                <div>
                                    <strong>{props.additionalInformationTitle}</strong>:
                                </div>
                            )
                        }
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
                        {
                            props.solutionInformationTitle !== undefined && props.solutionInformationTitle !== "" &&
                            (
                                <div>
                                    <strong>{props.solutionInformationTitle}</strong>:
                                </div>
                            )
                        }

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

// Checking props.
ValidatedSlider.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    step: PropTypes.number.isRequired,
    defaultValue: PropTypes.number,
    additionalInformationTitle: PropTypes.string,
    additionalInformationText: PropTypes.string,
    solutionInformationTitle: PropTypes.string,
    solutionInformationText: PropTypes.string,
    validationCallback: PropTypes.func.isRequired,
    required: PropTypes.bool,
    requiredErrorMessage: PropTypes.string,
    showMarks: PropTypes.bool
}

// Export.
export default ValidatedSlider;
