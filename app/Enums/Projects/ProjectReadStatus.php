<?php

declare(strict_types=1);

namespace App\Enums\Projects;

/**
 * Where a read of a connected project stands: waiting for the host, answered, failed, or given up unanswered.
 */
enum ProjectReadStatus: string
{
    case Pending = 'pending';
    case Answered = 'answered';
    case Failed = 'failed';
    case Expired = 'expired';

    public function isSettled(): bool
    {
        return $this !== self::Pending;
    }
}
