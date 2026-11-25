<?php

declare(strict_types=1);

namespace App\Events\Processes;

use App\Contracts\Processes\ClassificationRuleEvent;

/**
 * A command classification rule was restored from an earlier revision.
 */
final readonly class ClassificationRuleRestored extends ProcessEvent implements ClassificationRuleEvent
{
    public function __construct(public string $ruleId) {}
}
