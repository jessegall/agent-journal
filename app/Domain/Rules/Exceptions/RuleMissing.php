<?php

declare(strict_types=1);

namespace App\Domain\Rules\Exceptions;

use RuntimeException;

/**
 * No rule has the id asked for; the message is safe to show.
 */
final class RuleMissing extends RuntimeException
{
    public static function withId(int $ruleId): self
    {
        return new self("Rule {$ruleId} does not exist.");
    }
}
