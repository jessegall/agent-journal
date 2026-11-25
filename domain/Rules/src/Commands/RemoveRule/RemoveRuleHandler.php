<?php

declare(strict_types=1);

namespace Domain\Rules\Commands\RemoveRule;

use Domain\Rules\Commands\Support\RuleCommandHandler;
use Domain\Rules\Models\Rule;

/**
 * Removes the rule under its row lock and tells listeners once that has committed.
 */
final readonly class RemoveRuleHandler extends RuleCommandHandler
{
    public function handle(RemoveRuleCommand $command): void
    {
        $rule = Rule::findLockedById($command->ruleId);
        $rule->remove();
    }
}
