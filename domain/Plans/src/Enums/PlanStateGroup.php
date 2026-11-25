<?php

declare(strict_types=1);

namespace Domain\Plans\Enums;

/**
 * The plans list's three views by state: open (planned, started or paused), waiting for review, and closed (done or
 * cancelled).
 */
enum PlanStateGroup: string
{
    case Open = 'open';
    case Waiting = 'waiting';
    case Closed = 'closed';

    /**
     * @return list<PlanStatus>
     */
    public function states(): array
    {
        return match ($this) {
            self::Open => [
                PlanStatus::Planned,
                PlanStatus::Started,
                PlanStatus::Paused,
            ],
            self::Waiting => [PlanStatus::Reviewing],
            self::Closed => [
                PlanStatus::Done,
                PlanStatus::Cancelled,
            ],
        };
    }
}
