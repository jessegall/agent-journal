<?php

declare(strict_types=1);

namespace App\Supervision\Commands\CloseWorkChain;

use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandHandler;
use App\Supervision\Enums\WorkChainEnding;
use App\Supervision\Exceptions\AskRefused;
use App\Supervision\Models\CodeReview;
use App\Supervision\Support\SupervisorOwner;
use App\Supervision\Support\WorkChainEnd;

/**
 * Ends the chain for the owner alone.
 */
final readonly class CloseWorkChainHandler implements CommandHandler
{
    public function __construct(private SupervisorOwner $owner, private WorkChainEnd $chains) {}

    public function handle(CloseWorkChainCommand $command): void
    {
        if (! $this->owner->resolve()->endsAt(ActorIdentity::of($command->dispatchedBy()))) {
            throw AskRefused::onlyOwnerClosesChains();
        }

        $this->chains->end(CodeReview::latestFor($command->work), WorkChainEnding::Closed);
    }
}
