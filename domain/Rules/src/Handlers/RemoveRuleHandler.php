<?php

declare(strict_types=1);

namespace Domain\Rules\Handlers;

use App\Actors\Contracts\CurrentAuthorizer;
use App\Contracts\CommandHandler;
use Domain\Rules\Api\Events\RuleRemoved;
use Domain\Rules\Commands\RemoveRule;
use Domain\Rules\Enums\RuleAbility;
use Domain\Rules\Models\Rule;
use Domain\Rules\Policies\RulePolicy;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Removes the rule under its row lock and tells listeners once that has committed.
 */
final readonly class RemoveRuleHandler implements CommandHandler
{
    public function __construct(private CurrentAuthorizer $authorizer, private Dispatcher $events) {}

    public function handle(RemoveRule $command): void
    {
        $rule = Rule::lockedById($command->ruleId);
        $this->authorizer->authorize(RulePolicy::class, $rule, RuleAbility::Remove);
        $rule->remove();
        $this->events->dispatch(new RuleRemoved($command->ruleId));
    }
}
