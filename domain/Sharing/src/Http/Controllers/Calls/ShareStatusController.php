<?php

declare(strict_types=1);

namespace Domain\Sharing\Http\Controllers\Calls;

use Domain\Sharing\Calls\ShareProposals;
use Domain\Sharing\Calls\ShareStatusCall;
use Domain\Sharing\Data\ShareProposalStatusData;
use Domain\Sharing\Support\ProposalStatusResolver;

/**
 * Answers the current actor's share proposals.
 */
final readonly class ShareStatusController
{
    public function __invoke(ShareStatusCall $call, ProposalStatusResolver $proposals): ShareProposals
    {
        $statuses = array_map(ShareProposalStatusData::fromStatus(...), $proposals->ownProposals());

        return ShareProposals::from(['proposals' => $statuses]);
    }
}
