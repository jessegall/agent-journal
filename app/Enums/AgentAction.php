<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * What Home offers for an agent: open its live session's terminal, start or resume one when it is idle, switch a live one to
 * another driver, retry a switch whose launch failed, or recheck one whose stop or start is unconfirmed.
 */
enum AgentAction: string
{
    case Open = 'open';
    case Start = 'start';
    case Resume = 'resume';
    case Switch = 'switch';
    case Retry = 'retry';
    case Recheck = 'recheck';

    /**
     * The actions an agent in this state takes: a retired agent none, an open switch only what settles it.
     *
     * @return list<self>
     */
    public static function offeredFor(
        bool $isRetired,
        bool $isLive,
        bool $hasTerminal,
        bool $isResumable,
        DriverSwitchStage|null $switchStage,
    ): array {
        return match (true) {
            $isRetired => [],
            $switchStage === DriverSwitchStage::LaunchFailed => [self::Retry, self::Start],
            $switchStage?->isUnconfirmed() === true => [self::Recheck],
            $switchStage !== null && ! $switchStage->isFinal() => [],
            $isLive && $hasTerminal => [self::Open, self::Switch],
            $isLive => [self::Switch],
            $isResumable => [self::Start, self::Resume],
            default => [self::Start],
        };
    }
}
