<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Processes\ProposalStateChanged;
use App\Calls\Processes\WithdrawProposalCall;
use App\Commands\WithdrawRuleProposal\WithdrawRuleProposalCommand;
use App\Contracts\CommandBus;

/**
 * Withdraws a proposal.
 */
final readonly class WithdrawProposalController
{
    public function __invoke(WithdrawProposalCall $call, CommandBus $commands): ProposalStateChanged
    {
        $withdrawn = $commands->run(new WithdrawRuleProposalCommand($call->proposal));

        return ProposalStateChanged::from(['proposalId' => $withdrawn, 'state' => 'withdrawn']);
    }
}
