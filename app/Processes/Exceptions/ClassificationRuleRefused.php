<?php

declare(strict_types=1);

namespace App\Processes\Exceptions;

use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use App\Processes\Enums\ClassificationState;
use RuntimeException;

/**
 * A change to the active classification rule was refused: the caller expected another active revision, named a
 * revision of another rule, or retired a rule that is not active.
 */
final class ClassificationRuleRefused extends RuntimeException implements CommandRefusal
{
    use RendersRefusal;

    public static function stale(string $ruleId, int $expected, int $active): self
    {
        return new self("The rule {$ruleId} is at revision {$active}, not {$expected}; read it again and retry.");
    }

    public static function otherRule(string $ruleId, string $revisionRuleId): self
    {
        return new self("The revision belongs to the rule {$revisionRuleId}, not to {$ruleId}.");
    }

    public static function notNewer(string $ruleId, int $revision, int $active): self
    {
        return new self("The rule {$ruleId} cannot activate revision {$revision}: revision {$active} is active.");
    }

    public static function notActive(string $ruleId, ClassificationState $state): self
    {
        return new self("The rule {$ruleId} is {$state->value}, so it cannot be retired.");
    }

    protected function status(): int
    {
        return 409;
    }
}
