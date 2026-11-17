<?php

declare(strict_types=1);

namespace App\Domain\Rules\Actions;

use App\Core\Contracts\CurrentActor;
use App\Domain\Rules\Contracts\RuleReviewer;
use App\Domain\Rules\Events\RuleApproved;
use App\Domain\Rules\Events\RuleDenied;
use App\Domain\Rules\Models\Rule;
use Illuminate\Container\Attributes\Scoped;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Database\ConnectionInterface;

/**
 * The owner approves or denies a proposed rule, once, under the rule's row lock; only a user may.
 */
#[Scoped]
final readonly class ReviewRule implements RuleReviewer
{
    public function __construct(
        private CurrentActor $actors,
        private ConnectionInterface $database,
        private Dispatcher $events,
    ) {}

    public function approve(int $ruleId): void
    {
        $this->actors->actor()->requireUser();

        $this->database->transaction(function () use ($ruleId): void {
            Rule::lockedById($ruleId)->approve();
            $this->events->dispatch(new RuleApproved($ruleId));
        });
    }

    public function deny(int $ruleId): void
    {
        $this->actors->actor()->requireUser();

        $this->database->transaction(function () use ($ruleId): void {
            Rule::lockedById($ruleId)->deny();
            $this->events->dispatch(new RuleDenied($ruleId));
        });
    }
}
