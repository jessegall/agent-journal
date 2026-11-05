// every phase of the open plans as a place for a task, each with the tasks it holds, read from the plan board and each plan's outline
export async function readPlanPlaces(context) {
    const board = await context.read("plan board");
    if (!board.ok) return [];
    const outlines = await Promise.all(board.value.plans.map((plan) => context.read(`plan outline ${plan.id}`)));
    return outlines.flatMap((outline, index) => {
        const plan = board.value.plans[index];
        return outline.ok ? outline.value.phases.map((phase) => ({phaseId: phase.id, label: `Plan ${plan.id}: ${plan.title} › ${phase.title}`, taskIds: phase.tasks.map((task) => task.id)})) : [];
    });
}
