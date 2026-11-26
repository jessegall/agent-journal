<?php

declare(strict_types=1);

namespace App\Http\Controllers\Sharing\Api;

use App\Api\Sharing\ShareProposals;
use App\Api\Sharing\ShareStatusPayload;
use App\Sharing\Data\ShareProposalStatusData;
use App\Sharing\Support\ProposalStatusResolver;

/**
 * Answers the current actor's share proposals.
 */
final readonly class ShareStatusController
{
    public function __invoke(ShareStatusPayload $call, ProposalStatusResolver $proposals): ShareProposals
    {
        $statuses = array_map(ShareProposalStatusData::fromStatus(...), $proposals->ownProposals());

        return ShareProposals::from(['proposals' => $statuses]);
    }
}
