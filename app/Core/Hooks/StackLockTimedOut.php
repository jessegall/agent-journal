<?php

declare(strict_types=1);

namespace App\Core\Hooks;

use RuntimeException;
use Throwable;

final class StackLockTimedOut extends RuntimeException
{
    public static function after(OperationDeadline $deadline, Throwable $cause): self
    {
        return new self("The stack operation did not finish within {$deadline->milliseconds} ms and was rolled back.", previous: $cause);
    }
}
