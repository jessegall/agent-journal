<?php

declare(strict_types=1);

namespace App\Domain\Rules\Exceptions;

use RuntimeException;

/**
 * Only a proposed rule can be approved or denied; the message is safe to show.
 */
final class RuleNotProposed extends RuntimeException
{
    public static function inState(string $state): self
    {
        return new self("This rule is {$state} already, so it cannot be approved or denied.");
    }
}
