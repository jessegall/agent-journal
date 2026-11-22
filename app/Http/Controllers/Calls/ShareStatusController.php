<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Sharing\ShareProposals;
use App\Calls\Sharing\ShareStatusCall;
use App\Data\Sharing\ShareProposalStatusData;
use App\Support\ProposalStatusResolver;

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
