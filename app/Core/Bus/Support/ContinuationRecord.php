<?php

declare(strict_types=1);

namespace App\Core\Bus\Support;

use Throwable;

/**
 * What one middleware's continuation saw while it ran: whether it was called, what the next step returned, and what
 * it threw.
 */
final class ContinuationRecord
{
    public bool $called = false;

    public mixed $result = null;

    public Throwable|null $failure = null;
}
