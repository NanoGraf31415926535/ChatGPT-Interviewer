// Imports.
import React, {useEffect, useContext, useRef} from "react";
import { useTranslation } from "react-i18next";
import globalContext from "../../src/context";
import PropTypes from 'prop-types';
import "bootstrap-icons/font/bootstrap-icons.css";

// The component.
const ValidatedNumberInput = (props) => {

    const { t } = useTranslation('bmt-template-components-validated-number-input');

    // Get the global state and define the keys for accessing data in the global state.
    const { state, setState, f } = useContext(globalContext);
    const key = props.name;

    const keyValue = key + '_value';
    const keyPreviousValues = key + '_previous-values';
    const keyStatus = key + '_status';
    const keyRef = key + '_ref';
    const refValue = useRef(null);

    const keyValueErrorOccurred = key + '_value-error-occurred';
    const keyNumberOfValueErrors = key + '_number-of-value-errors';
    const keyShowValueErrorMessage = key + '_show-value-error-message';
    const keyValueErrorMessageShown = key + '_value-error-message-shown';

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

    const onInput = () => {
        // Change global state to hide the pattern error message.
        setState((prevState) => ({
            ...prevState,
            [keyStatus]: 0,
            [keyShowValueErrorMessage]: false,
            [keyShowRequiredErrorMessage]: false
        }));
    };

    const onBlur = (e) => {
        const inputElem = e.target;
        const currentValue = inputElem.value;

        // Check if the input is a number and inside the range.
        // Set/Remove error class.
        if (currentValue !== "" && isNaN(f(currentValue))) {
            // Remove value from global state and set the error flag
            setState((prevState) => ({
                ...prevState,
                [keyValue]: null,
                [keyStatus]: -1,
                [keyNumberOfValueErrors]: prevState[keyNumberOfValueErrors] + 1,
                [keyShowValueErrorMessage]: true,
                [keyValueErrorMessageShown]: 1
            }));
        } else if (currentValue !== "" && (props.max !== undefined && f(inputElem.value) > props.max || props.min !== undefined && f(inputElem.value) < props.min)) {
            // Remove value from global state and set the error flag
            setState((prevState) => ({
                ...prevState,
                [keyValue]: null,
                [keyStatus]: -1,
                [keyValueErrorOccurred]: 1,
                [keyNumberOfValueErrors]: prevState[keyNumberOfValueErrors] + 1,
                [keyShowValueErrorMessage]: true,
                [keyValueErrorMessageShown]: 1
            }));
        } else {
            // Add to the global state.
            setState((prevState) => ({
                ...prevState,
                [keyValue]: f(currentValue),
                [keyStatus]: 0
            }));
        }
    };

    // Initial state values.
    useEffect(() => {
        // Add to the global state.
        setState((prevState) => ({
            ...prevState,
            [keyValue]: prevState[keyValue] !== undefined ? prevState[keyValue] : null,
            [keyPreviousValues]: prevState[keyPreviousValues] !== undefined ? prevState[keyPreviousValues] : [],
            [keyStatus]: prevState[keyStatus] !== undefined ? prevState[keyStatus] : 0,
            [keyValueErrorOccurred]: prevState[keyValueErrorOccurred] !== undefined ? prevState[keyValueErrorOccurred] : 0,
            [keyNumberOfValueErrors]: prevState[keyNumberOfValueErrors] !== undefined ? prevState[keyNumberOfValueErrors] : 0,
            [keyShowValueErrorMessage]: prevState[keyShowValueErrorMessage] !== undefined ? prevState[keyShowValueErrorMessage] : false,
            [keyValueErrorMessageShown]: prevState[keyValueErrorMessageShown] !== undefined ? prevState[keyValueErrorMessageShown] : 0,
            [keyShowAdditionalInformation]: prevState[keyShowAdditionalInformation] !== undefined ? prevState[keyShowAdditionalInformation] : false,
            [keyAdditionalInformationShown]: prevState[keyAdditionalInformationShown] !== undefined ? prevState[keyAdditionalInformationShown] : 0,
            [keyAdditionalInformationAvailable]: (props.additionalInformationTitle !== undefined && props.additionalInformationTitle !== "") || (props.additionalInformationText !== undefined && props.additionalInformationText !== ""),
            [keyShowSolutionInformation]: prevState[keyShowSolutionInformation] !== undefined ? prevState[keyShowSolutionInformation] : false,
            [keySolutionInformationShown]: prevState[keySolutionInformationShown] !== undefined ? prevState[keySolutionInformationShown] : 0,
            [keySolutionInformationAvailable]: (props.solutionInformationTitle !== undefined && props.solutionInformationTitle !== "") || (props.solutionInformationText !== undefined && props.solutionInformationText !== ""),
            [keyValidationErrorOccurred]: prevState[keyValidationErrorOccurred] !== undefined ? prevState[keyValidationErrorOccurred] : 0,
            [keyNumberOfValidationErrors]: prevState[keyNumberOfValidationErrors] !== undefined ? prevState[keyNumberOfValidationErrors] : 0,
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

            <div className="join">
                <input
                    ref={refValue}
                    type="text"
                    name={props.name}
                    className={`input input-bordered join-item w-40 ${
                        state[keyStatus] === 1 ? "input-success" : state[keyStatus] === -1 ? "input-error" : ""
                    }`}
                    placeholder={
                        props.placeholder || t("default-placeholder")
                    }
                    onInput={onInput}
                    onBlur={onBlur}
                    required={props.required !== undefined ? props.required : false}
                    defaultValue={state[keyValue] !== undefined && !isNaN(state[keyValue]) ? state[keyValue] : ""}
                />
                {
                    props.unit &&
                    <div className={"join-item px-5 flex items-center justify-center bg-gray-300 font-medium"}>
                        {props.unit}
                    </div>
                }
            </div>

            {
                state[keyShowValueErrorMessage] &&
                (
                    <div className="ml-1 mt-1">
                        <span className="label-text-alt text-red-500">
                            {
                                props.valueErrorMessage ??
                                (props.min !== undefined && props.max !== undefined) ? t("default-value-error-message-minmax", {min: props.min, max: props.max}) :
                                    (props.min !== undefined ? t("default-value-error-message-min", {min: props.min}) : t("default-value-error-message-max", {max: props.max}))
                            }
                        </span>
                    </div>
                )
            }

            {
                state[keyShowRequiredErrorMessage] &&
                (
                    <div className="ml-1 mt-1">
                        <span className="label-text-alt text-red-500">
                            {props.requiredErrorMessage ?? t("default-required-error-message") }
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

// Checking props.
ValidatedNumberInput.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    min: PropTypes.number,
    max: PropTypes.number,
    unit:PropTypes.string,
    valueErrorMessage: PropTypes.string,
    additionalInformationTitle: PropTypes.string,
    additionalInformationText: PropTypes.string,
    solutionInformationTitle: PropTypes.string,
    solutionInformationText: PropTypes.string,
    validationCallback: PropTypes.func.isRequired,
    required: PropTypes.bool,
    requiredErrorMessage: PropTypes.string
}

// Export.
export default ValidatedNumberInput;
