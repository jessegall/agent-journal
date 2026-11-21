<?php

declare(strict_types=1);

namespace Domain\Rules\Handlers;

use Domain\Rules\Commands\RemoveRule;
use Domain\Rules\Handlers\Support\RuleCommandHandler;
use Domain\Rules\Models\Rule;

/**
 * Removes the rule under its row lock and tells listeners once that has committed.
 */
final readonly class RemoveRuleHandler extends RuleCommandHandler
{
    public function handle(RemoveRule $command): void
    {
        $rule = Rule::lockedById($command->ruleId);
        $rule->remove();
    }
}
