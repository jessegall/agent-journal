export const CUSTOM_PRESET = "custom";

// the preset a form matches: the first preset whose every value is the value in the form, else custom. The presets
// are [{key, values: {setting key: on or off}}] as the screen read gives them; the form is {setting key: on or off}.
export function currentPreset(values, presets) {
    const match = presets.find((preset) => Object.entries(preset.values).every(([key, value]) => values[key] === value));
    return match ? match.key : CUSTOM_PRESET;
}
