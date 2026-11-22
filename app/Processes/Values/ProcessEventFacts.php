<?php

declare(strict_types=1);

namespace App\Processes\Values;

/**
 * One event of a run as it is kept: its type and the facts that type stores, built only by the event it is.
 */
final readonly class ProcessEventFacts
{
    /**
     * @param  array<string, string|int>  $facts
     */
    private function __construct(public string $type, public array $facts) {}

    public static function partQueued(PartKey $part): self
    {
        return new self('part_queued', ['part' => $part->name()]);
    }

    public static function partStarted(PartKey $part, int $pid): self
    {
        return new self('part_started', ['part' => $part->name(), 'pid' => $pid]);
    }

    /**
     * A part that runs inside its parent's process, so it has no pid of its own.
     */
    public static function partStartedInside(PartKey $part): self
    {
        return new self('part_started', ['part' => $part->name()]);
    }

    public static function partEnded(PartKey $part, PartEnd $end): self
    {
        return new self('part_ended', ['part' => $part->name(), 'end' => $end->type->value, 'code' => $end->code]);
    }

    public static function partSkipped(PartKey $part, string $controllingResult): self
    {
        return new self('part_skipped', ['part' => $part->name(), 'because' => $controllingResult]);
    }

    public static function partStartFailed(PartKey $part, string $reason): self
    {
        return new self('part_start_failed', ['part' => $part->name(), 'reason' => $reason]);
    }

    public static function partStopped(PartKey $part, string $reason): self
    {
        return new self('part_stopped', ['part' => $part->name(), 'reason' => $reason]);
    }

    public static function partLost(PartKey $part): self
    {
        return new self('part_lost', ['part' => $part->name()]);
    }

    public static function runStopped(string $reason): self
    {
        return new self('run_stopped', ['reason' => $reason]);
    }

    public static function runFinished(int $rootStatus): self
    {
        return new self('run_finished', ['root_status' => $rootStatus]);
    }
}
