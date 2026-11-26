<?php

declare(strict_types=1);

namespace App\Connections\Enums;

/**
 * Where one journal verb run for a connected machine stands: running; completed or failed by its exit code; asked to
 * cancel, which is not yet stopped; cancelled; interrupted, when its process is known to have ended unrecorded; or
 * unknown, when no proof of its process survives.
 */
enum CommandRunStatus: string
{
    case Running = 'running';
    case Completed = 'completed';
    case Failed = 'failed';
    case CancellationRequested = 'cancellation_requested';
    case Cancelled = 'cancelled';
    case Interrupted = 'interrupted';
    case Unknown = 'unknown';

    /**
     * The states a run may still be running in; a cancellation asked for is not proof it stopped.
     *
     * @return list<self>
     */
    public static function active(): array
    {
        return [
            self::Running,
            self::CancellationRequested,
        ];
    }

    public function isActive(): bool
    {
        return in_array($this, self::active(), true);
    }

    /**
     * What an exit of the process settles a run in this state as: a cancellation asked for ends cancelled.
     */
    public function settledBy(int $exitCode): self
    {
        if ($this === self::CancellationRequested) {
            return self::Cancelled;
        }

        if ($exitCode === 0) {
            return self::Completed;
        }

        return self::Failed;
    }
}
