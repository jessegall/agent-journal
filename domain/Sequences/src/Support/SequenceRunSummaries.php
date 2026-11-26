<?php

declare(strict_types=1);

namespace Domain\Sequences\Support;

use App\Exceptions\RecordUnavailable;
use App\Processes\Enums\Tone;
use App\Records\Contracts\SummaryProvider;
use App\Records\Values\RecordStanding;
use App\Records\Values\RecordSummary;
use App\Records\Values\SummaryLine;
use App\Records\Values\SummaryPeriod;
use App\Values\ProjectOwner;
use Carbon\CarbonImmutable;
use Domain\Sequences\Enums\SequenceRunStatus;
use Domain\Sequences\Models\SequenceRun;

/**
 * Sequence runs as the chat lines show them: the name, how long the run has run, frozen at its end, and each step
 * with whether it is done, runs now or waits. One run is read by its id, a batch in one query.
 */
final readonly class SequenceRunSummaries implements SummaryProvider
{
    public function requireReadable(string $id): RecordSummary
    {
        return self::summary(
            SequenceRun::query()
                ->acrossActors()
                ->whereKey($id)
                ->firstOr(RecordUnavailable::throwing()->forModel(SequenceRun::class, $id)),
        );
    }

    /**
     * A sequence run is its runner's and of no project, so it is Global.
     */
    public function ownerOf(string $id): ProjectOwner
    {
        return ProjectOwner::global();
    }

    public function visibleSummaries(array $ids): array
    {
        $runs = SequenceRun::query()->acrossActors()->whereKey($ids)->readExactly(count($ids))->get();

        return array_values($runs->map(self::summary(...))->all());
    }

    private static function summary(SequenceRun $run): RecordSummary
    {
        $steps = array_map(
            fn (string $step, int $index) => new SummaryLine(
                "step-{$index}",
                ($index + 1).' · '.$step,
                self::standing($run, $index + 1),
            ),
            $run->steps,
            array_keys($run->steps),
        );

        $started = CarbonImmutable::instance($run->created_at ?? CarbonImmutable::now());
        $ended = $run->status->needsWork() ? null : CarbonImmutable::instance($run->updated_at ?? $started);

        return new RecordSummary($run->id, $run->name, lines: $steps, period: new SummaryPeriod($started, $ended));
    }

    /**
     * Where a step stands: done, running now, or waiting for its turn.
     */
    private static function standing(SequenceRun $run, int $step): RecordStanding
    {
        $isDone = $step < $run->current_step || $run->status === SequenceRunStatus::Finished;
        $isRunning = $step === $run->current_step && $run->status->needsWork();

        return match (true) {
            $isDone => new RecordStanding('Done', Tone::Muted),
            $isRunning => new RecordStanding('Running', Tone::Note),
            default => new RecordStanding('Waiting', Tone::Neutral),
        };
    }
}
