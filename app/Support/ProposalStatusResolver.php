<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\CurrentActor;
use App\Models\Share;

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

        return array_map(fn (Share $proposal) => $proposal->proposalStatus(), Share::proposedBy($proposer));
    }
}
