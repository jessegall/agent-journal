<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\CommandRules\ClassificationStatus;
use App\Enums\Engine\RefusalCode;
use RuntimeException;

/**
 * A change to the active classification rule was refused: the caller expected another active revision, named a
 * revision of another rule, or retired a rule that is not active.
 */
final class ClassificationRuleRefused extends RuntimeException implements CodedRefusal, CommandRefusal
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

    public static function notActive(string $ruleId, ClassificationStatus $status): self
    {
        return new self("The rule {$ruleId} is {$status->value}, so it cannot be retired.");
    }

    protected function status(): int
    {
        return 409;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::StateBlocked;
    }
}
