<?php

declare(strict_types=1);

namespace App\Domain\Plans\Enums;

/**
 * Where a plan stands, in the words of doc 4's state badge: planned until it starts, reviewing while a review holds it,
 * then started, paused, cancelled or done.
 */
enum PlanState: string
{
    case Planned = 'planned';
    case Reviewing = 'reviewing';
    case Started = 'started';
    case Paused = 'paused';
    case Cancelled = 'cancelled';
    case Done = 'done';

    /**
     * Whether a plan in this state may start: only a planned one. The plans read offers the start by the same rule.
     */
    public function canStart(): bool
    {
        return $this === self::Planned;
    }
}
