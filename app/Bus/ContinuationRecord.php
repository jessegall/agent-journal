<?php

declare(strict_types=1);

namespace App\Bus;

use Throwable;

/**
 * What one middleware's continuation saw while it ran: whether it was called, what the next step returned, and what
 * it threw.
 */
final class ContinuationRecord
{
    public bool $wasCalled = false;

    public mixed $continuationReply = null;

    public Throwable|null $failure = null;
}
