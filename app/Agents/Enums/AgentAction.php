<?php

declare(strict_types=1);

namespace App\Agents\Enums;

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
        bool $retired,
        bool $live,
        bool $hasTerminal,
        bool $resumable,
        DriverSwitchStage|null $switchStage,
    ): array {
        return match (true) {
            $retired => [],
            $switchStage === DriverSwitchStage::LaunchFailed => [self::Retry, self::Start],
            $switchStage?->isUnconfirmed() === true => [self::Recheck],
            $switchStage !== null && ! $switchStage->isFinal() => [],
            $live && $hasTerminal => [self::Open, self::Switch],
            $live => [self::Switch],
            $resumable => [self::Start, self::Resume],
            default => [self::Start],
        };
    }
}
