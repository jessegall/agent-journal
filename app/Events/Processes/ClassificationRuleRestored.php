<?php

declare(strict_types=1);

namespace App\Events\Processes;

/**
 * A command classification rule was restored from an earlier revision.
 */
final readonly class ClassificationRuleRestored extends ProcessEvent
{
    public function __construct(public string $ruleId) {}
}
