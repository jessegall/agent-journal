<?php

declare(strict_types=1);

namespace Domain\Chat\Enums;

/**
 * What one line of an agent's technical log tells: its start asked, refused or ended, a host process started or
 * ended, a wake or a turn opened or failed.
 */
enum AgentLogLineType: string
{
    case StartAsked = 'start-asked';
    case StartRefused = 'start-refused';
    case StartEnded = 'start-ended';
    case ProcessStarted = 'process-started';
    case ProcessEnded = 'process-ended';
    case ProcessFailed = 'process-failed';
    case Woke = 'woke';
    case WakeFailed = 'wake-failed';
    case TurnOpened = 'turn-opened';
    case TurnFailed = 'turn-failed';
    case Retrying = 'retrying';
    case GaveUp = 'gave-up';

    public function isFailure(): bool
    {
        return in_array(
            $this,
            [self::StartRefused, self::ProcessFailed, self::WakeFailed, self::TurnFailed, self::GaveUp],
            true,
        );
    }

    /**
     * The line's words as the chat shows them.
     */
    public function title(): string
    {
        return match ($this) {
            self::StartAsked => 'Start asked',
            self::StartRefused => 'Start refused',
            self::StartEnded => 'Session ended',
            self::ProcessStarted => 'Process started',
            self::ProcessEnded => 'Process ended',
            self::ProcessFailed => 'Process failed',
            self::Woke => 'Woke',
            self::WakeFailed => 'Wake failed',
            self::TurnOpened => 'Turn opened',
            self::TurnFailed => 'Turn failed',
            self::Retrying => 'Retrying',
            self::GaveUp => 'Gave up',
        };
    }
}
