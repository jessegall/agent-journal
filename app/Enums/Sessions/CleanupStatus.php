<?php

declare(strict_types=1);

namespace App\Enums\Sessions;

/**
 * Where a start's cleanup stands: pending until the host removed every transient resource, done once it did, and
 * failed when its deletions kept failing past the retries.
 */
enum CleanupStatus: string
{
    case Pending = 'pending';
    case Done = 'done';
    case Failed = 'failed';
}
