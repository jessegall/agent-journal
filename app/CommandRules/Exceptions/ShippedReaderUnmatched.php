<?php

declare(strict_types=1);

namespace App\CommandRules\Exceptions;

use LogicException;

/**
 * A shipped reader names a core rule Core does not declare.
 */
final class ShippedReaderUnmatched extends LogicException
{
    public static function forRule(string $rule): self
    {
        return new self("A shipped reader approves the core rule {$rule}, which Core does not declare.");
    }
}
