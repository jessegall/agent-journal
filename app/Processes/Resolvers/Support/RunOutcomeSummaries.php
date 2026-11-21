<?php

declare(strict_types=1);

namespace App\Processes\Resolvers\Support;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use App\Processes\Data\RunOutcomeSummaryData;
use App\Processes\Models\ProcessRun;
use App\Processes\Models\RunOutcome;
use App\Processes\Support\ProjectKey;
use PhpOption\Option;

/**
 * Reads a run's outcome for the reader beside RunSnapshotResolver, but only its safe summary: the run must belong to
 * the current project, and the reader must be its responsible actor, the user its request entitled, or someone the
 * actor-and-project policy lets read the whole run. Who may open the full run is asked again of that policy.
 */
final readonly class RunOutcomeSummaries
{
    public function __construct(
        private CurrentActor $actors,
        private ProjectKey $projects,
    ) {}

    /**
     * @return Option<RunOutcomeSummaryData>
     */
    public function summaryOf(string $runId): Option
    {
        $run = ProcessRun::query()
            ->acrossActors()
            ->where('project_key', $this->projects->current())
            ->whereKey($runId)
            ->first();

        return Option::fromValue($run)
            ->filter(fn (ProcessRun $found) => $this->mayHearOf($found))
            ->flatMap(fn (ProcessRun $found) => RunOutcome::ofRun($found)
                ->map(fn (RunOutcome $outcome) => $this->summary($found, $outcome)));
    }

    /**
     * Whether the existing actor-and-project policy lets the reader read the whole run.
     */
    public function mayOpenFullRun(string $runId): bool
    {
        return ProcessRun::query()
            ->forActor()
            ->where('project_key', $this->projects->current())
            ->whereKey($runId)
            ->exists();
    }

    private function mayHearOf(ProcessRun $run): bool
    {
        return $run->hasOutcomeFor(ActorIdentity::of($this->actors->actor())) || $this->mayOpenFullRun($run->id);
    }

    private function summary(ProcessRun $run, RunOutcome $outcome): RunOutcomeSummaryData
    {
        return new RunOutcomeSummaryData(
            $run->id,
            $outcome->result->summaryFor($run->plan),
            substr($outcome->attempt_id, -8),
            $outcome->result->value,
            $outcome->updated_at->toIso8601String(),
            $this->mayOpenFullRun($run->id),
        );
    }
}
