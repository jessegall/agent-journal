<?php

declare(strict_types=1);

namespace Domain\Rules\Handlers;

use Domain\Rules\Api\Events\RuleRemoved;
use Domain\Rules\Commands\RemoveRule;
use Domain\Rules\Models\Rule;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Removes the rule under its row lock and tells listeners once that has committed.
 */
final readonly class RemoveRuleHandler
{
    public function __construct(private Dispatcher $events) {}

    public function handle(RemoveRule $command): void
    {
        Rule::lockedById($command->ruleId)->remove();
        $this->events->dispatch(new RuleRemoved($command->ruleId));
    }
}
