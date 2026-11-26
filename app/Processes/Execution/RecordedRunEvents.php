<?php

declare(strict_types=1);

namespace App\Processes\Execution;

use App\Models\Runs\PartRun;
use App\Models\Runs\ProcessEvent;
use App\Models\Runs\ProcessRun;
use App\Processes\Contracts\Events\RunEvents;
use App\Processes\Enums\CaptureStatus;
use App\Processes\Enums\OutputStream;
use App\Processes\Enums\RunLogicalResult;
use App\Processes\Enums\RunResultSource;
use App\Processes\RunOutcomes;
use App\Processes\Values\PartKey;
use App\Processes\Values\ProcessEventFacts;
use App\Reads\Contracts\OutputRecorder;
use App\Values\CapturedChunk;
use App\Values\PartEnd;
use Carbon\CarbonImmutable;

/**
 * Applies a run's events on the server: each one is kept as a numbered process event and moves its part's record
 * through its legal lifecycle; output goes to the recorder.
 */
final class RecordedRunEvents implements RunEvents
{
    /**
     * @var array<string, PartRun>
     */
    private array $parts = [];

    private int $sequence = 0;

    public function __construct(
        private readonly ProcessRun $run,
        private readonly OutputRecorder $recorder,
        private readonly RunOutcomes $outcomes = new RunOutcomes(),
    ) {}

    public function queued(PartKey $part): void
    {
        if (! $this->note(ProcessEventFacts::partQueued($part))) {
            return;
        }

        $this->parts[$part->name()] = PartRun::create($this->run, $part);
    }

    public function started(PartKey $part, int $pid, string $host): void
    {
        if (! $this->note(ProcessEventFacts::partStarted($part, $pid))) {
            return;
        }

        $this->part($part)->start($host, $pid);
    }

    public function startedInside(PartKey $part, string $host): void
    {
        if (! $this->note(ProcessEventFacts::partStartedInside($part))) {
            return;
        }

        $this->part($part)->start($host);
    }

    public function output(PartKey $part, OutputStream $stream, string $bytes): void
    {
        $this->recorder->append(new CapturedChunk($this->part($part), $stream, $bytes, CarbonImmutable::now()));
    }

    public function ended(PartKey $part, PartEnd $end, bool $isDrained): void
    {
        if (! $this->note(ProcessEventFacts::partEnded($part, $end))) {
            return;
        }

        $record = $this->part($part);
        $record->finishProcess($end);
        $record->finishDraining();
        $this->recorder->finish($record, $end);

        if (! $isDrained) {
            $record->markCapture(CaptureStatus::Incomplete);
        }
    }

    public function skipped(PartKey $part, string $controllingResult): void
    {
        if (! $this->note(ProcessEventFacts::partSkipped($part, $controllingResult))) {
            return;
        }

        $this->part($part)->skip($controllingResult);
    }

    public function spawnFailed(PartKey $part, string $reason): void
    {
        if (! $this->note(ProcessEventFacts::partStartFailed($part, $reason))) {
            return;
        }

        $this->part($part)->failToSpawn($reason);
    }

    public function stopped(PartKey $part, string $reason): void
    {
        if (! $this->note(ProcessEventFacts::partStopped($part, $reason))) {
            return;
        }

        $this->part($part)->stop($reason);
    }

    public function lost(PartKey $part): void
    {
        if (! $this->note(ProcessEventFacts::partLost($part))) {
            return;
        }

        $this->part($part)->lose();
    }

    public function staleReason(PartKey $part): string
    {
        return $this->run->refresh()->stale_reason;
    }

    public function runStopped(string $reason): void
    {
        if (! $this->note(ProcessEventFacts::runStopped($reason))) {
            return;
        }

        $this->run->markStopped($reason);
        $this->outcomes->record($this->run, RunLogicalResult::Stopped, RunResultSource::Signed);
    }

    /**
     * Records the attempt's signed root result once; a replayed event changes nothing, and a run already stopped
     * keeps Stopped as its result.
     */
    public function runFinished(int $rootStatus): void
    {
        if (! $this->note(ProcessEventFacts::runFinished($rootStatus)) || $this->run->refresh()->isStopped()) {
            return;
        }

        $this->outcomes->record($this->run, RunLogicalResult::ofRootStatus($rootStatus), RunResultSource::Signed);
    }

    /**
     * Numbers the next event as the host numbered it, so a replayed event is recognised.
     */
    public function at(int $sequence): self
    {
        $this->sequence = $sequence - 1;

        return $this;
    }

    /**
     * How many bytes of a part's stream are stored already.
     */
    public function outputOffset(PartKey $part, OutputStream $stream): int
    {
        return $this->part($part)->stream_offsets[$stream->value] ?? 0;
    }

    private function part(PartKey $part): PartRun
    {
        return $this->parts[$part->name()] ??= PartRun::query()
            ->ofProcessRun($this->run->id)
            ->atNode($part->node)
            ->withAttempt($part->attempt)
            ->firstOrFail();
    }

    /**
     * Keeps the event under its number and reports whether it is new: a repeat or a conflicting event changes nothing.
     */
    private function note(ProcessEventFacts $facts): bool
    {
        $event = ProcessEvent::create($this->run, ++$this->sequence, $facts);

        return $event->wasRecentlyCreated && $event->sequence === $this->sequence;
    }
}
