<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\AccessRuleType;

/**
 * What an access policy decided about one operation: allowed or refused, by which rule and why.
 */
final readonly class AccessDecision
{
    private function __construct(
        public bool $allowed,
        public AccessRuleType $rule,
        public string $reason,
    ) {}

    public static function allowed(AccessRuleType $rule, string $reason): self
    {
        return new self(true, $rule, $reason);
    }

    public static function refused(AccessRuleType $rule, string $reason): self
    {
        return new self(false, $rule, $reason);
    }
}
