<?php

declare(strict_types=1);

namespace App\Agents\Enums;

/**
 * What Home says an agent is doing: working in a live session, idle, in the middle of a switch, failed to launch
 * its replacement or to have its start claimed, or retired.
 */
enum AgentPresence: string
{
    case Working = 'working';
    case Idle = 'idle';
    case PendingSwitch = 'pending-switch';
    case Failed = 'failed';
    case Retired = 'retired';

    public static function of(bool $retired, bool $live, DriverSwitchStage|null $switchStage, bool $startRefused): self
    {
        return match (true) {
            $retired => self::Retired,
            $switchStage === DriverSwitchStage::LaunchFailed, $startRefused => self::Failed,
            $switchStage !== null && ! $switchStage->isFinal() => self::PendingSwitch,
            $live => self::Working,
            default => self::Idle,
        };
    }

    public function label(): string
    {
        return match ($this) {
            self::Working => 'Working',
            self::Idle => 'Idle',
            self::PendingSwitch => 'Switching',
            self::Failed => 'Failed',
            self::Retired => 'Retired',
        };
    }
}
