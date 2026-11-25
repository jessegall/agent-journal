<?php

declare(strict_types=1);

namespace Domain\Rules\Commands\ApproveRule;

use App\Support\ActorReference;
use Domain\Rules\Commands\Support\RuleCommandHandler;
use Domain\Rules\Models\Rule;

/**
 * Approves the rule once, under its row lock, and tells listeners once that has committed.
 */
final readonly class ApproveRuleHandler extends RuleCommandHandler
{
    public function handle(ApproveRuleCommand $command): void
    {
        $rule = Rule::findLockedById($command->ruleId);
        $rule->approveBy(ActorReference::of($command->dispatchedBy()));
    }
}
