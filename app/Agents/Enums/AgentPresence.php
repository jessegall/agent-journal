<?php

declare(strict_types=1);

namespace App\Agents\Enums;

use App\Agents\Drivers\Enums\DriverSwitchStage;

/**
 * What Home says an agent is doing: working in a live session, idle, in the middle of a switch, failed to start
 * its replacement or to have its start claimed, or retired.
 */
enum AgentPresence: string
{
    case Working = 'working';
    case Idle = 'idle';
    case PendingSwitch = 'pending-switch';
    case Failed = 'failed';
    case Retired = 'retired';

    public static function of(
        bool $isRetired,
        bool $isLive,
        DriverSwitchStage|null $switchStage,
        bool $isStartRefused,
    ): self {
        return match (true) {
            $isRetired => self::Retired,
            $switchStage === DriverSwitchStage::StartFailed, $isStartRefused => self::Failed,
            $switchStage !== null && ! $switchStage->isFinal() => self::PendingSwitch,
            $isLive => self::Working,
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
