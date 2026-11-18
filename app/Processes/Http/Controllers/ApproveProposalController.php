<?php

declare(strict_types=1);

namespace App\Processes\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Processes\ReviewRequest;
use App\Processes\Commands\ApproveRuleProposal;
use Illuminate\Http\JsonResponse;

/**
 * A project owner approves a proposal; the bus refuses an agent.
 */
final readonly class ApproveProposalController
{
    public function __invoke(ReviewRequest $request, string $proposal, CommandBus $commands): JsonResponse
    {
        return new JsonResponse($commands->run(new ApproveRuleProposal($proposal, $request->approval()))->toArray());
    }
}
