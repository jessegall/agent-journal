<?php

declare(strict_types=1);

namespace App\Processes\Execution;

use App\Processes\Contracts\OutputRecorder;
use App\Processes\Contracts\RunEvents;
use App\Processes\Enums\CaptureState;
use App\Processes\Enums\OutputStream;
use App\Processes\Models\PartRun;
use App\Processes\Models\ProcessEvent;
use App\Processes\Models\ProcessRun;
use App\Processes\Values\CapturedChunk;
use App\Processes\Values\PartEnd;
use App\Processes\Values\PartKey;
use App\Processes\Values\ProcessEventPayload;
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

    public function __construct(private readonly ProcessRun $run, private readonly OutputRecorder $recorder) {}

    public function queued(PartKey $part): void
    {
        if (! $this->note('part_queued', new ProcessEventPayload(part: $part->name()))) {
            return;
        }
        $this->parts[$part->name()] = PartRun::queue($this->run, $part);
    }

    public function started(PartKey $part, int $pid, string $host): void
    {
        if (! $this->note('part_started', new ProcessEventPayload(part: $part->name(), pid: $pid))) {
            return;
        }
        $this->part($part)->start($pid, $host);
    }

    public function startedInside(PartKey $part, string $host): void
    {
        if (! $this->note('part_started', new ProcessEventPayload(part: $part->name()))) {
            return;
        }
        $this->part($part)->startInside($host);
    }

    public function output(PartKey $part, OutputStream $stream, string $bytes): void
    {
        $this->recorder->append(new CapturedChunk($this->part($part), $stream, $bytes, CarbonImmutable::now()));
    }

    public function ended(PartKey $part, PartEnd $end, bool $drained): void
    {
        $payload = new ProcessEventPayload(part: $part->name(), end: $end->type->value, code: $end->code);

        if (! $this->note('part_ended', $payload)) {
            return;
        }
        $record = $this->part($part);
        $record->finishProcess($end);
        $record->finishDraining();
        $this->recorder->finish($record, $end);
        if (! $drained) {
            $record->markCapture(CaptureState::Incomplete);
        }
    }

    public function skipped(PartKey $part, string $controllingResult): void
    {
        if (! $this->note('part_skipped', new ProcessEventPayload(part: $part->name(), because: $controllingResult))) {
            return;
        }
        $this->part($part)->skip($controllingResult);
    }

    public function spawnFailed(PartKey $part, string $reason): void
    {
        if (! $this->note('part_start_failed', new ProcessEventPayload(part: $part->name(), reason: $reason))) {
            return;
        }
        $this->part($part)->failToSpawn($reason);
    }

    public function stopped(PartKey $part, string $reason): void
    {
        if (! $this->note('part_stopped', new ProcessEventPayload(part: $part->name(), reason: $reason))) {
            return;
        }
        $this->part($part)->stop($reason);
    }

    public function lost(PartKey $part): void
    {
        if (! $this->note('part_lost', new ProcessEventPayload(part: $part->name()))) {
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
        if (! $this->note('run_stopped', new ProcessEventPayload(reason: $reason))) {
            return;
        }
        $this->run->markStopped($reason);
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
            ->where('process_run_id', $this->run->id)
            ->where('syntax_node', $part->node)
            ->where('attempt', $part->attempt)
            ->firstOrFail();
    }

    /**
     * Keeps the event under its number and reports whether it is new: a repeat or a conflicting event changes nothing.
     */
    private function note(string $type, ProcessEventPayload $payload): bool
    {
        $event = ProcessEvent::record($this->run, ++$this->sequence, $type, $payload->toArray());

        return $event->wasRecentlyCreated && $event->sequence === $this->sequence;
    }
}
