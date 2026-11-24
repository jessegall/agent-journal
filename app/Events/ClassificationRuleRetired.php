<?php

declare(strict_types=1);

namespace App\Events;

/**
 * A command classification rule was retired for the reason given.
 */
final readonly class ClassificationRuleRetired extends ProcessEvent
{
    public function __construct(
        public string $ruleId,
        public string $reason,
    ) {}
}
