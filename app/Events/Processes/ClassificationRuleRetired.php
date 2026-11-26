<?php

declare(strict_types=1);

namespace App\Events\Processes;

use App\Processes\Contracts\ClassificationRuleEvent;

/**
 * A command classification rule was retired for the reason given.
 */
final readonly class ClassificationRuleRetired implements ClassificationRuleEvent, ProcessEvent
{
    public function __construct(
        public string $ruleId,
        public string $reason,
    ) {}
}
