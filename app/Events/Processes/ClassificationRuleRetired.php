<?php

declare(strict_types=1);

namespace App\Events\Processes;

use App\Contracts\Processes\ClassificationRuleEvent;

/**
 * A command classification rule was retired for the reason given.
 */
final readonly class ClassificationRuleRetired extends ProcessEvent implements ClassificationRuleEvent
{
    public function __construct(
        public string $ruleId,
        public string $reason,
    ) {}
}
