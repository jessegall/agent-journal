<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Pages\Resolvers;

use App\Contracts\Actors\CurrentActor;
use App\Contracts\Navigation\SectionResolver;
use App\Declarations\SlotContext;
use Domain\Plans\Data\TaskPlanData;
use Domain\Plans\Models\Phase;
use Domain\Tasks\Contracts\TaskResolver;

/**
 * The plan and phase of the task open in Tasks' reader, read from Plans' own tables by the task's id. The task's
 * visibility is checked again through Tasks; every signed-in actor reads every plan, so a caller who may read the task
 * sees its plan.
 */
final readonly class TaskPlanSection implements SectionResolver
{
    public function __construct(
        private CurrentActor $actors,
        private TaskResolver $tasks,
    ) {}

    public function read(SlotContext $context): TaskPlanData
    {
        $this->actors->actor();
        $taskId = (string) $context->id;
        $this->tasks->requireVisible($taskId);
        $phase = Phase::query()->holdingTask($taskId)->with('plan')->first();

        return $phase === null ? TaskPlanData::from([]) : TaskPlanData::ofPhase($phase);
    }
}
