<?php

declare(strict_types=1);

namespace App\Values;

use App\Models\Runs\ProcessEvent;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * One event of a run as it is kept: its type and the facts that type stores, built only by the event it is. A
 * conflict names the sequence it conflicts with and the facts that came under it.
 */
#[MapName(SnakeCaseMapper::class)]
final class ProcessEventFacts extends Data
{
    private function __construct(
        public readonly string $type,
        public readonly string|null $part = null,
        public readonly int|null $pid = null,
        public readonly string|null $end = null,
        public readonly int|null $code = null,
        public readonly string|null $because = null,
        public readonly string|null $reason = null,
        public readonly int|null $rootStatus = null,
        public readonly int|null $conflictsWith = null,
        public readonly self|null $conflicting = null,
    ) {}

    public static function partQueued(PartKey $part): self
    {
        return new self('part_queued', part: $part->name());
    }

    public static function partStarted(PartKey $part, int $pid): self
    {
        return new self('part_started', part: $part->name(), pid: $pid);
    }

    /**
     * A part that runs inside its parent's process, so it has no pid of its own.
     */
    public static function partStartedInside(PartKey $part): self
    {
        return new self('part_started', part: $part->name());
    }

    public static function partEnded(PartKey $part, PartEnd $end): self
    {
        return new self('part_ended', part: $part->name(), end: $end->type->value, code: $end->code);
    }

    public static function partSkipped(PartKey $part, string $controllingResult): self
    {
        return new self('part_skipped', part: $part->name(), because: $controllingResult);
    }

    public static function partStartFailed(PartKey $part, string $reason): self
    {
        return new self('part_start_failed', part: $part->name(), reason: $reason);
    }

    public static function partStopped(PartKey $part, string $reason): self
    {
        return new self('part_stopped', part: $part->name(), reason: $reason);
    }

    public static function partLost(PartKey $part): self
    {
        return new self('part_lost', part: $part->name());
    }

    public static function runStopped(string $reason): self
    {
        return new self('run_stopped', reason: $reason);
    }

    public static function runFinished(int $rootStatus): self
    {
        return new self('run_finished', rootStatus: $rootStatus);
    }

    /**
     * An event that came under a sequence another event already holds: the journal's own error, naming both.
     */
    public static function conflict(int $sequence, self $conflicting): self
    {
        return new self(ProcessEvent::OPERATIONAL_ERROR, conflictsWith: $sequence, conflicting: $conflicting);
    }
}
