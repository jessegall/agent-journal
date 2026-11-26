<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Api\Processes\ProposalStateChanged;
use App\Api\Processes\WithdrawProposalPayload;
use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\CommandRules\Commands\WithdrawRuleProposal\WithdrawRuleProposalCommand;

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
