<?php

declare(strict_types=1);

namespace App\Domain\Rules\Actions;

use App\Core\Actors\ActorContext;
use App\Domain\Rules\Events\RuleApproved;
use App\Domain\Rules\Events\RuleDenied;
use App\Domain\Rules\Models\Rule;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Database\ConnectionInterface;

/**
 * The owner approves or denies a proposed rule, once, under the rule's row lock; only a user may.
 */
final readonly class ReviewRule
{
    public function __construct(
        private ActorContext $actor,
        private ConnectionInterface $database,
        private Dispatcher $events,
    ) {}

    public function approve(Rule $rule): void
    {
        $this->actor->requireUser();

        $this->database->transaction(function () use ($rule): void {
            Rule::lockedFor($rule)->approve();
            $this->events->dispatch(new RuleApproved($rule->id));
        });
    }

    public function deny(Rule $rule): void
    {
        $this->actor->requireUser();

        $this->database->transaction(function () use ($rule): void {
            Rule::lockedFor($rule)->deny();
            $this->events->dispatch(new RuleDenied($rule->id));
        });
    }
}
