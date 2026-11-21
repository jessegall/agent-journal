<?php

declare(strict_types=1);

namespace Domain\Rules\Handlers;

use App\Actors\Support\ActorIdentity;
use Domain\Rules\Commands\ApproveRule;
use Domain\Rules\Handlers\Support\RuleCommandHandler;
use Domain\Rules\Models\Rule;

/**
 * Approves the rule once, under its row lock, and tells listeners once that has committed.
 */
final readonly class ApproveRuleHandler extends RuleCommandHandler
{
    public function handle(ApproveRule $command): void
    {
        $rule = Rule::lockedById($command->ruleId);
        $rule->approveBy(ActorIdentity::of($command->dispatchedBy()));
    }
}
