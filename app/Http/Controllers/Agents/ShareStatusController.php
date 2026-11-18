<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents;

use App\Http\Data\Sharing\ShareProposalStatusData;
use App\Sharing\Support\ProposalStatusReader;
use App\Sharing\Support\ShareProposalStatus;
use Illuminate\Http\JsonResponse;

/**
 * The calling agent's own share proposals, newest first, as number and state only.
 */
final readonly class ShareStatusController
{
    public function __invoke(ProposalStatusReader $proposals): JsonResponse
    {
        return new JsonResponse(['proposals' => array_map(fn (ShareProposalStatus $status) => ShareProposalStatusData::fromStatus($status), $proposals->ownProposals())]);
    }
}
