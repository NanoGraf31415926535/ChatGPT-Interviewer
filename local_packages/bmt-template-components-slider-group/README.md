# bmt-template-components-slider-group

Displays a range input and 1-3 dynamic labels that depend on its current value. 

## git commands

Adding to a template:

```shell
git subtree add --prefix local_packages/bmt-template-components-slider-group https://gitlab.rlp.net/bmt/templates/components/bmt-template-components-slider-group.git main

```

Updating:

```shell
git subtree pull --prefix local_packages/bmt-template-components-slider-group https://gitlab.rlp.net/bmt/templates/components/bmt-template-components-slider-group.git main

```

## Signature and props

- name: unique identifier for the input field
- label: question text
- required: applicable only if no default is set (otherwise, range input will always have some value)
- requiredErrorMessage: optional; otherwise, defaults to "Please activate the slider to answer this question."
- disabled: for instructions, payoff feedback 
- defaultValue: inital position; if omitted, will start "non-activated"
- min: left end of the scale
- max: right end of the scale
- step: step size. 
  - It is recommended to use values 0-N with step size 1, as otherwise, there is a danger of rounding problems.
- leftLabel: A fixed label shown to the left above the slider,
- centerLabel: A fixed label shown to the center above the slider,
- rightLabel: A fixed label shown to the right above the slider,
- leftOutcomeCallback: A function (value -> label) that computes a value shown below the left end of the slider
- centerOutcomeCallback: A function (value -> label) that computes a value shown below the center of the slider
rightOutcomeCallback: A function (value -> label) that computes a value shown below the right of the slider
- showTicks: boolean, displays tick symbols below the range
- tickLabels: displays tick labels below the scale. Should be an array of nodes, one for each tick, or string 'auto', which will display the numbers  associated with each tick, i.e. (min, min+ step, ... max).

## Notes

- A typical usage would be to represent splitting money between two causes, with the leftOutcomeCallback representing what will happen to the left cause, and the right one accordingly. (example: bmt-template-convex-time-budgets-money)

- If no default value is set, the slider will start "non-activated" in order to avoid anchoring/default effects. This should be explained in the instructions whenever applicable.

- Should use the Form component for validation (at least if the initial state is "not activated").

- If a template uses many similar slider groups, it is recommended to wrap them in a local component (again, seebmt-template-convex-time-budgets-money)