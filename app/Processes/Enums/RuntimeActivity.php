<?php

declare(strict_types=1);

namespace App\Processes\Enums;

use App\Agents\Drivers\Enums\ExpectedTiming;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * What an agent's runtime is doing, as its host last reported it.
 */
#[TypeScript]
enum RuntimeActivity: string
{
    case Starting = 'starting';
    case Idle = 'idle';
    case Running = 'running';
    case Interrupting = 'interrupting';
    case Stopping = 'stopping';
    case Stopped = 'stopped';
    case HostUnavailable = 'host_unavailable';

    /**
     * When a request accepted now is expected to land, judged from this last reported activity.
     *
     * Whether the runtime is ending or ended, so it takes no new requests.
     */
    public function isStopping(): bool
    {
        return $this === self::Stopping || $this === self::Stopped;
    }

    public function expectedTiming(): ExpectedTiming
    {
        return match ($this) {
            self::Idle => ExpectedTiming::ExpectedNow,
            self::Running, self::Interrupting => ExpectedTiming::ExpectedNextTurn,
            self::Starting, self::Stopping, self::Stopped, self::HostUnavailable => ExpectedTiming::Unknown,
        };
    }
}
