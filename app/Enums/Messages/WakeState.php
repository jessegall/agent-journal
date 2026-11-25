<?php

declare(strict_types=1);

namespace App\Enums\Messages;

/**
 * Where waking one recipient of a message stands, as its sender reads it: still being tried, waiting for the
 * recipient to start, taken by its runtime, given up after too many failures, or no longer needed.
 */
enum WakeState: string
{
    case Pending = 'pending';
    case WaitingForStartup = 'waiting_for_startup';
    case Accepted = 'accepted';
    case Exhausted = 'exhausted';
    case Cancelled = 'cancelled';
}
