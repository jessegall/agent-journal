<?php

declare(strict_types=1);

namespace App\Domain\Tasks\Enums;

/**
 * Where one run of a task stands, as the stack sees it.
 */
enum TaskWorkState: string
{
    case Active = 'active';
    case Blocked = 'blocked';
    case Finished = 'finished';
    case Cancelled = 'cancelled';

    public function needsWork(): bool
    {
        return $this === self::Active;
    }
}
