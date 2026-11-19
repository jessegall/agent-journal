<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Contracts\CommandRefusal;
use InvalidArgumentException;

/**
 * Execution budgets a host cannot give: a limit of zero or less, swap different from memory, or more than the host's
 * maximum for one helper.
 */
final class ExecutionBudgetInvalid extends InvalidArgumentException implements CommandRefusal
{
    public static function notPositive(string $budget, int $value): self
    {
        return new self("The budget {$budget} must be above zero, not {$value}.");
    }

    public static function swapDiffers(int $memoryBytes, int $memorySwapBytes): self
    {
        return new self(
            "Memory and swap are limited alike: {$memorySwapBytes} bytes of swap differs from {$memoryBytes} bytes "
                .'of memory.',
        );
    }

    public static function aboveHost(string $budget, int $value, int $most): self
    {
        return new self("The budget {$budget} is at most {$most} on this host, not {$value}.");
    }
}
