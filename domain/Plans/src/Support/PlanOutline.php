<?php

declare(strict_types=1);

namespace Domain\Plans\Support;

use Domain\Plans\Data\PhaseHeadingData;
use Domain\Plans\Data\PhaseTaskData;
use Domain\Plans\Data\PhaseTaskPageData;
use Domain\Plans\Data\PlanOutlineData;
use Domain\Plans\Models\Phase;
use Domain\Plans\Models\PhaseTask;
use Domain\Tasks\Contracts\TaskResolver;
use Domain\Tasks\Contracts\TaskWaitResolver;
use Domain\Tasks\Values\TaskSummary;
use Spatie\LaravelData\Optional;

/**
 * Reads a plan's outline by cursor, never whole: a page of phase headings by (plan, number, id), and a page of one
 * phase's tasks by (position, task id) at the revision the reader holds, with the page's task summaries from Tasks in
 * one batch. The rows read follow the page sizes, never the plan's or the phase's size.
 */
final readonly class PlanOutline
{
    public const int PHASES_PER_PAGE = 50;

    public const int TASKS_PER_PAGE = 50;

    public function __construct(
        private TaskResolver $tasks,
        private TaskWaitResolver $waits,
    ) {}

    public function of(string $planId, int|null $currentPhase, OutlinePageAsk $ask): PlanOutlineData
    {
        $headings = Phase::findHeadingsIn($planId, $ask->phasesAfter, self::PHASES_PER_PAGE + 1);
        $shown = $headings->take(self::PHASES_PER_PAGE);

        $fields = [
            'phases' => array_values($shown->map(
                fn (Phase $phase) => PhaseHeadingData::ofPhase($phase, $currentPhase),
            )->all()),
            'phasesAfter' => (string) $ask->phasesAfter,
        ];

        if ($headings->count() > self::PHASES_PER_PAGE) {
            $fields['nextPhasesAfter'] = (string) $headings[self::PHASES_PER_PAGE - 1]->number;
        }

        if ($ask->phase !== null) {
            $phase = Phase::findNumberedInPlanId($planId, $ask->phase);
            $fields['phaseTasks'] = $this->tasksOf($phase, $ask->tasksAfter, $ask->revision);
        }

        return PlanOutlineData::from($fields);
    }

    /**
     * The page of the phase's tasks after the position; when the phase is no longer at the revision the reader holds,
     * its first page, marked as a changed revision.
     */
    public function tasksOf(Phase $phase, int $afterPosition, int $revision): PhaseTaskPageData
    {
        $isRevisionChanged = $revision !== 0 && $revision !== $phase->revision;
        $after = $isRevisionChanged ? 0 : $afterPosition;
        $page = PhaseTask::resolvePageOf($phase->id, $after, self::TASKS_PER_PAGE + 1);
        $shown = array_slice($page, 0, self::TASKS_PER_PAGE, true);

        return PhaseTaskPageData::from([
            'phase' => (string) $phase->number,
            'revision' => $phase->revision,
            'isRevisionChanged' => $isRevisionChanged,
            'after' => (string) $after,
            'rows' => $this->rowsOf(array_values($shown)),
            'nextAfter' => count($page) > self::TASKS_PER_PAGE
                ? (string) array_key_last($shown)
                : Optional::create(),
        ]);
    }

    /**
     * The page's rows in their order, with whether each task waits on another, read in one query for the page.
     *
     * @param  list<string>  $taskIds
     * @return list<PhaseTaskData>
     */
    private function rowsOf(array $taskIds): array
    {
        $waiting = array_flip($this->waits->withWaitsAmong($taskIds));

        return array_map(
            fn (string $taskId, TaskSummary $summary) => PhaseTaskData::ofSummary($summary, isset($waiting[$taskId])),
            $taskIds,
            $this->tasks->summaries($taskIds),
        );
    }
}
