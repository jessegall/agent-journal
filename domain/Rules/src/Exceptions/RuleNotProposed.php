<?php

declare(strict_types=1);

namespace Domain\Rules\Exceptions;

use App\Contracts\Refusals\FieldRefusal;
use RuntimeException;

/**
 * Only a proposed rule can be approved or denied; the message is safe to show.
 */
final class RuleNotProposed extends RuntimeException implements FieldRefusal
{
    public static function inState(string $state): self
    {
        return new self("This rule is {$state} already, so it cannot be approved or denied.");
    }

    public function field(): string
    {
        return 'review';
    }

    public function fieldError(): string
    {
        return $this->getMessage();
    }
}
