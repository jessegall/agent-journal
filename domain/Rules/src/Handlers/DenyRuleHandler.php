<?php

declare(strict_types=1);

namespace Domain\Rules\Handlers;

use Domain\Rules\Commands\DenyRule;
use Domain\Rules\Handlers\Support\RuleCommandHandler;
use Domain\Rules\Models\Rule;

/**
 * Denies the rule once, under its row lock, and tells listeners once that has committed.
 */
final readonly class DenyRuleHandler extends RuleCommandHandler
{
    public function handle(DenyRule $command): void
    {
        $rule = Rule::lockedById($command->ruleId);
        $rule->deny();
    }
}
