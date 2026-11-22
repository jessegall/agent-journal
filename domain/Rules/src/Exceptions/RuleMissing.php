<?php

declare(strict_types=1);

namespace Domain\Rules\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use RuntimeException;

/**
 * No rule has the id asked for; the message is safe to show.
 */
final class RuleMissing extends RuntimeException implements CommandRefusal
{
    public static function withId(string $ruleId): self
    {
        return new self("Rule {$ruleId} does not exist.");
    }
}
