<?php

declare(strict_types=1);

namespace Domain\Plans\Support;

use App\Contracts\Actors\CurrentActor;
use App\Contracts\Assignments\AssignmentResolver;
use App\Contracts\Time\VerificationTiming;
use App\Contracts\Work\ActorStackSessions;
use App\Support\AssigneeIdentity;
use App\Support\IdListPage;
use App\Values\TimingVerdict;
use Domain\Plans\Enums\PlanState;
use Domain\Plans\Models\PhaseTask;
use Domain\Plans\Models\Plan;
use Domain\Tasks\Contracts\TaskProgressCounter;
use Domain\Tasks\Contracts\TaskResolver;
use Domain\Tasks\Values\TaskSummary;

/**
 * Holds an agent's tests and checks while the current phase of a started plan it holds still has open or started
 * tasks; an agent without a plan phase, and a user, may run them.
 */
final readonly class PhaseTiming implements VerificationTiming
{
    private const int PHASE_BATCH_SIZE = 100;

    public function __construct(
        private CurrentActor $actors,
        private ActorStackSessions $stackSessions,
        private AssignmentResolver $assignments,
        private TaskResolver $tasks,
        private TaskProgressCounter $taskCounts,
    ) {}

    public function forCaller(): TimingVerdict
    {
        // An actor that works in no session, such as the owner, runs its checks whenever it asks.
        if ($this->stackSessions->admittableSessions() === []) {
            return TimingVerdict::allowed();
        }

        $holder = AssigneeIdentity::of($this->actors->actor());
        $afterId = null;

        do {
            $page = $this->assignments->recordIdsFor(
                Plan::linkType(),
                $holder,
                new IdListPage($afterId, IdListPage::LARGEST_LIMIT),
            );

            $started = Plan::query()->amongIds($page->ids)->inStates([PlanState::Started])
                ->oldestFirst()->readExactly(count($page->ids))->get();

            foreach ($started as $plan) {
                $verdict = $this->verdictOf($plan);

                if (! $verdict->isAllowed()) {
                    return $verdict;
                }
            }

            $afterId = $page->nextAfterId;
        } while ($afterId !== null);

        return TimingVerdict::allowed();
    }

    /**
     * The plan's current phase is its first with a task that has not ended; its open and started tasks hold checks.
     */
    private function verdictOf(Plan $plan): TimingVerdict
    {
        $afterNumber = 0;

        do {
            $phases = $plan->phases()->afterNumber($afterNumber)->readUpTo(self::PHASE_BATCH_SIZE)->get();
            $taskIdsByPhase = PhaseTask::resolveTaskIdsByPhase(array_values(array_map(strval(...), $phases->modelKeys())));
            $progressByPhase = $this->taskCounts->progressByGroup($taskIdsByPhase);

            foreach ($phases as $phase) {
                $afterNumber = $phase->number;
                $taskIds = $taskIdsByPhase[$phase->id];
                $progress = $progressByPhase[$phase->id];

                if ($progress->total !== count($taskIds)) {
                    $this->tasks->requireAllVisible($taskIds);
                }

                if ($progress->unfinished() === 0) {
                    continue;
                }

                if ($progress->unfinished() === $progress->blocked) {
                    return TimingVerdict::allowed();
                }

                return $this->verdictForPhase($plan->number, $phase->number, $taskIds);
            }
        } while ($phases->count() === self::PHASE_BATCH_SIZE);

        return TimingVerdict::allowed();
    }

    /**
     * @param  list<string>  $taskIds
     */
    private function verdictForPhase(int $planNumber, int $phaseNumber, array $taskIds): TimingVerdict
    {
        $holding = array_filter(
            $this->tasks->summaries($taskIds),
            fn (TaskSummary $task) => $task->state->isHoldingChecks(),
        );

        if ($holding === []) {
            return TimingVerdict::allowed();
        }

        $numbers = array_values(array_map(fn (TaskSummary $task) => $task->number, $holding));

        return TimingVerdict::refused($planNumber, $phaseNumber, $numbers);
    }
}
