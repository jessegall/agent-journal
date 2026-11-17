<?php

declare(strict_types=1);

namespace App\Domain\Plans;

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
}
