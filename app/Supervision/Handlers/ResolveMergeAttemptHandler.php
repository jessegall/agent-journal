<?php

declare(strict_types=1);

namespace App\Supervision\Handlers;

use App\Actors\Support\ActorIdentity;
use App\Agents\Enums\MergeAttemptState;
use App\Agents\Models\MergeAttempt;
use App\Contracts\CommandHandler;
use App\Supervision\Commands\ResolveMergeAttempt;
use App\Supervision\Exceptions\AskRefused;
use App\Supervision\Support\MergeSettlement;
use App\Supervision\Support\SupervisorOwner;

/**
 * Records the owner's statement on an uncertain merge and settles its ask by it; only the owner may, and only an
 * uncertain attempt takes one.
 */
final readonly class ResolveMergeAttemptHandler implements CommandHandler
{
    public function __construct(private SupervisorOwner $owner, private MergeSettlement $settlement) {}

    public function handle(ResolveMergeAttempt $command): void
    {
        if (! $this->owner->resolve()->endsAt(ActorIdentity::of($command->dispatchedBy()))) {
            throw AskRefused::onlyOwnerResolvesMerges();
        }

        $attempt = MergeAttempt::lockedById($command->attemptId);

        if ($attempt->state !== MergeAttemptState::Uncertain || ! $command->outcome->isTerminal()) {
            throw AskRefused::mergeNotUncertain($attempt->id);
        }

        $attempt->resolveByOwner($command->outcome, $command->result, $command->statement);
        $this->settlement->settle($attempt);
    }
}
