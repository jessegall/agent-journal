<?php

declare(strict_types=1);

namespace Domain\Rules\Handlers;

use App\Contracts\CommandHandler;
use Domain\Rules\Api\Events\RuleDenied;
use Domain\Rules\Commands\DenyRule;
use Domain\Rules\Models\Rule;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Denies the rule once, under its row lock, and tells listeners once that has committed.
 */
final readonly class DenyRuleHandler implements CommandHandler
{
    public function __construct(private Dispatcher $events) {}

    public function handle(DenyRule $command): void
    {
        $rule = Rule::lockedById($command->ruleId);
        $rule->deny();
        $this->events->dispatch(new RuleDenied($command->ruleId));
    }
}
