<?php

declare(strict_types=1);

namespace App\Exceptions;

use LogicException;

/**
 * Two start plan parts of one driver both set a field a plan holds once.
 */
final class PlanAdditionClash extends LogicException
{
    public static function of(string $field): self
    {
        return new self("Two start plan parts both set the plan's {$field}.");
    }
}
