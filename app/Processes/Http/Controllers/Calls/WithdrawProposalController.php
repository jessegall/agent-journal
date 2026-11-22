<?php

declare(strict_types=1);

namespace App\Processes\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use App\Processes\Calls\ProposalStateChanged;
use App\Processes\Calls\WithdrawProposalCall;
use App\Processes\Commands\WithdrawRuleProposal\WithdrawRuleProposalCommand;

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
