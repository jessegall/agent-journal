<?php

declare(strict_types=1);

namespace App\Http\Controllers\Processes;

use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Processes\ReviewRequest;
use App\Processes\Commands\RejectRuleProposal;
use Illuminate\Http\JsonResponse;

/**
 * A project owner rejects a proposal with a reason; the bus refuses an agent.
 */
final readonly class RejectProposalController
{
    public function __invoke(ReviewRequest $request, string $proposal, CommandBus $commands): JsonResponse
    {
        $rejected = $commands->run(new RejectRuleProposal($proposal, $request->reason()));

        return new JsonResponse(['proposal_id' => $rejected, 'state' => 'rejected']);
    }
}
