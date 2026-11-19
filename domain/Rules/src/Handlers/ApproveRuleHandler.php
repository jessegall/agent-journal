<?php

declare(strict_types=1);

namespace Domain\Rules\Handlers;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Contracts\CurrentAuthorizer;
use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandHandler;
use Domain\Rules\Api\Events\RuleApproved;
use Domain\Rules\Commands\ApproveRule;
use Domain\Rules\Enums\RuleAbility;
use Domain\Rules\Models\Rule;
use Domain\Rules\Policies\RulePolicy;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Approves the rule once, under its row lock, and tells listeners once that has committed.
 */
final readonly class ApproveRuleHandler implements CommandHandler
{
    public function __construct(
        private CurrentAuthorizer $authorizer,
        private CurrentActor $actors,
        private Dispatcher $events,
    ) {}

    public function handle(ApproveRule $command): void
    {
        $rule = Rule::lockedById($command->ruleId);
        $this->authorizer->authorize(RulePolicy::class, $rule, RuleAbility::Approve);
        $rule->approveBy(ActorIdentity::of($this->actors->actor()));
        $this->events->dispatch(new RuleApproved($command->ruleId));
    }
}
