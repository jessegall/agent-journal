<?php

declare(strict_types=1);

namespace Domain\Sharing\Support;

use App\Contracts\Actors\CurrentActor;
use App\Support\ActorIdentity;
use Domain\Sharing\Models\Share;

/**
 * The calling agent's own share proposals, newest first, as number and state only: never another agent's, never a
 * token, address or configuration.
 */
final readonly class ProposalStatusResolver
{
    public function __construct(private CurrentActor $actors) {}

    /**
     * @return list<ShareProposalStatus>
     */
    public function ownProposals(): array
    {
        $proposer = ActorIdentity::of($this->actors->actor());

        return array_map(fn (Share $proposal) => $proposal->proposal_status, Share::findProposedBy($proposer));
    }
}
