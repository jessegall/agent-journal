<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Api\Processes\ProposalStateChanged;
use App\Api\Processes\WithdrawProposalPayload;
use App\Attributes\Bus\Dispatches;
use App\Commands\CommandRules\WithdrawRuleProposal\WithdrawRuleProposalCommand;
use App\Contracts\Bus\CommandBus;

/**
 * Withdraws a proposal.
 */
final readonly class WithdrawProposalController
{
    #[Dispatches(WithdrawRuleProposalCommand::class)]
    public function __invoke(WithdrawProposalPayload $call, CommandBus $commands): ProposalStateChanged
    {
        $withdrawn = $commands->run(new WithdrawRuleProposalCommand($call->proposal));

        return ProposalStateChanged::from(['proposalId' => $withdrawn, 'state' => 'withdrawn']);
    }
}
