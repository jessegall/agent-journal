<?php

declare(strict_types=1);

namespace App\Support\CommandLines;

use App\Contracts\CommandLines\Condition;

/**
 * The condition that holds for every context: a rule that always applies.
 *
 * @implements Condition<object>
 */
final readonly class AnyContext implements Condition
{
    public function holdsFor(object $context): bool
    {
        return true;
    }
}
