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
     * @return list<PlanState>
     */
    public function states(): array
    {
        return match ($this) {
            self::Open => [
                PlanState::Planned,
                PlanState::Started,
                PlanState::Paused,
            ],
            self::Waiting => [PlanState::Reviewing],
            self::Closed => [
                PlanState::Done,
                PlanState::Cancelled,
            ],
        };
    }
}
