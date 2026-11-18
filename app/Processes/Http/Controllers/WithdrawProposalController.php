<?php

declare(strict_types=1);

namespace App\Processes\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use App\Processes\Commands\WithdrawRuleProposal;
use Illuminate\Http\JsonResponse;

/**
 * The author withdraws their proposal; it stays readable.
 */
final readonly class WithdrawProposalController
{
    public function __invoke(string $proposal, CommandBus $commands): JsonResponse
    {
        $withdrawn = $commands->run(new WithdrawRuleProposal($proposal));

        return new JsonResponse(['proposal_id' => $withdrawn, 'state' => 'withdrawn']);
    }
}
