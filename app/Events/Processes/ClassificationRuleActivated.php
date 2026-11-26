<?php

declare(strict_types=1);

namespace App\Events\Processes;

use App\Processes\Contracts\ClassificationRuleEvent;

/**
 * A command classification rule took a revision as its active one.
 */
final readonly class ClassificationRuleActivated implements ClassificationRuleEvent, ProcessEvent
{
    public function __construct(public string $ruleId) {}
}
