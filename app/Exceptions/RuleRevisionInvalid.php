<?php

declare(strict_types=1);

namespace App\Exceptions;

use LogicException;

/**
 * An approved rule revision was about to be written without what its purpose requires.
 */
final class RuleRevisionInvalid extends LogicException
{
    public static function readerMissing(string $ruleId): self
    {
        return new self("The rule {$ruleId} is a test, check or build, so its approval names one proven reader.");
    }

    public static function readerWithoutContract(string $ruleId): self
    {
        return new self("The rule {$ruleId} has no verification contract, so its approval names no reader.");
    }
}
