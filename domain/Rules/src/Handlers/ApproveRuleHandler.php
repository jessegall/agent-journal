<?php

declare(strict_types=1);

namespace Domain\Rules\Handlers;

use App\Contracts\CommandHandler;
use Domain\Rules\Api\Events\RuleApproved;
use Domain\Rules\Commands\ApproveRule;
use Domain\Rules\Models\Rule;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Approves the rule once, under its row lock, and tells listeners once that has committed.
 */
final readonly class ApproveRuleHandler implements CommandHandler
{
    public function __construct(private Dispatcher $events) {}

    public function handle(ApproveRule $command): void
    {
        Rule::lockedById($command->ruleId)->approve();
        $this->events->dispatch(new RuleApproved($command->ruleId));
    }
}
