<?php

declare(strict_types=1);

namespace App\Commands\CloseWorkChain;

use App\Contracts\CommandHandler;
use App\Enums\WorkChainEnding;
use App\Exceptions\AskRefused;
use App\Models\CodeReview;
use App\Support\ActorIdentity;
use App\Support\SupervisorOwner;
use App\Support\WorkChainEnd;

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
