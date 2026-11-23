<?php

declare(strict_types=1);

namespace App\Resolvers\Support;

use App\Contracts\Actors\CurrentActor;
use App\Data\RunOutcomeSummaryData;
use App\Models\Runs\ProcessRun;
use App\Models\Runs\RunOutcome;
use App\Support\ActorIdentity;
use App\Support\ProjectKey;
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
            ->firstOption();

        return $run
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
