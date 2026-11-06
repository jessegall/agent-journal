export async function readPlanPlaces(window) {
    await window.reload("places");
    if (window.props.places.failure.value) return [];
    return window.props.places.rows.value.map((place) => ({phaseId: place.id, label: place.label, taskIds: place.task_ids}));
}
