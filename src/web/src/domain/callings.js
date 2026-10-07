export const CALLINGS = [
    {key: "title and name", label: "Title and name"},
    {key: "name", label: "First name"},
    {key: "none", label: "No name"},
];

export const callingLabel = (key) => (CALLINGS.find((calling) => calling.key === key) || CALLINGS[0]).label;
