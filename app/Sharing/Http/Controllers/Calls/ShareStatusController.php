<?php

declare(strict_types=1);

namespace App\Sharing\Http\Controllers\Calls;

use App\Http\Data\Sharing\ShareProposalStatusData;
use App\Sharing\Calls\ShareProposals;
use App\Sharing\Calls\ShareStatusCall;
use App\Sharing\Support\ProposalStatusResolver;

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
