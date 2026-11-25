<?php

declare(strict_types=1);

namespace App\Commands\Reviews\ResolveMergeAttempt;

use App\Contracts\Bus\CommandHandler;
use App\Enums\Reviews\MergeAttemptState;
use App\Exceptions\AskRefused;
use App\Models\Reviews\MergeAttempt;
use App\Support\ActorIdentity;
use App\Support\MergeSettlement;
use App\Support\SupervisorOwner;

/**
 * Records the owner's statement on an uncertain merge and settles its ask by it; only the owner may, and only an
 * uncertain attempt takes one.
 */
final readonly class ResolveMergeAttemptHandler implements CommandHandler
{
    public function __construct(private SupervisorOwner $owner, private MergeSettlement $settlement) {}

    public function handle(ResolveMergeAttemptCommand $command): void
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
