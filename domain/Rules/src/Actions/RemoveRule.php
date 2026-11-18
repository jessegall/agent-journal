<?php

declare(strict_types=1);

namespace Domain\Rules\Actions;

use Domain\Rules\Api\Events\RuleRemoved;
use Domain\Rules\Models\Rule;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Database\ConnectionInterface;

/**
 * Ends a rule and tells listeners once that has committed.
 */
final readonly class RemoveRule
{
    public function __construct(
        private ConnectionInterface $database,
        private Dispatcher $events,
    ) {}

    public function remove(Rule $rule): void
    {
        $this->database->transaction(function () use ($rule): void {
            $rule->remove();
            $this->events->dispatch(new RuleRemoved($rule->id));
        });
    }
}
