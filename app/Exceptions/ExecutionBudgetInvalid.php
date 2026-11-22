<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\CommandRefusal;
use InvalidArgumentException;

/**
 * Execution budgets a host cannot give: a limit of zero or less, swap different from memory, or more than the host's
 * maximum for one helper.
 */
final class ExecutionBudgetInvalid extends InvalidArgumentException implements CommandRefusal
{
    public static function notPositive(string $budget, int $amount): self
    {
        return new self("The budget {$budget} must be above zero, not {$amount}.");
    }

    public static function swapDiffers(int $bytes, int $swapBytes): self
    {
        return new self(
            sprintf(
                'Memory and swap are limited alike: %s bytes of swap differs from %s bytes of memory.',
                $swapBytes,
                $bytes,
            ),
        );
    }

    public static function aboveHost(string $budget, int $amount, int $most): self
    {
        return new self("The budget {$budget} is at most {$most} on this host, not {$amount}.");
    }
}
