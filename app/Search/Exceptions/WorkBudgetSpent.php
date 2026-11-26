<?php

declare(strict_types=1);

namespace App\Search\Exceptions;

use RuntimeException;

/**
 * A provider charged more work than its call allows; the search counts the source as out of time for this call.
 */
final class WorkBudgetSpent extends RuntimeException
{
    public static function of(string $work, int $allowance): self
    {
        return new self("A search call may spend at most {$allowance} {$work}.");
    }
}
