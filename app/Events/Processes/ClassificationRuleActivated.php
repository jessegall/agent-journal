<?php

declare(strict_types=1);

namespace App\Events\Processes;

use App\Contracts\Processes\ClassificationRuleEvent;

/**
 * A command classification rule took a revision as its active one.
 */
final readonly class ClassificationRuleActivated extends ProcessEvent implements ClassificationRuleEvent
{
    public function __construct(public string $ruleId) {}
}
