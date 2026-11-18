<?php

declare(strict_types=1);

namespace App\Sharing\Support;

use App\Actors\Contracts\CurrentActor;
use App\Sharing\Models\Share;

/**
 * The calling agent's own share proposals, newest first, as number and state only: never another agent's, never a
 * token, address or configuration.
 */
final readonly class ProposalStatusReader
{
    public function __construct(private CurrentActor $actors) {}

    /**
     * @return list<ShareProposalStatus>
     */
    public function ownProposals(): array
    {
        $agent = $this->actors->actor();
        $agent->requireAgent();

        return array_map(fn (Share $proposal) => $proposal->proposalStatus(), Share::proposedBy($agent->actorId()));
    }
}
