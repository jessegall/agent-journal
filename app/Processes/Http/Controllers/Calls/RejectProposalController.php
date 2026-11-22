<?php

declare(strict_types=1);

namespace App\Processes\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use App\Processes\Calls\ProposalStateChanged;
use App\Processes\Calls\RejectProposalCall;
use App\Processes\Commands\RejectRuleProposal\RejectRuleProposalCommand;

/**
 * Rejects a proposal.
 */
final readonly class RejectProposalController
{
    public function __invoke(RejectProposalCall $call, CommandBus $commands): ProposalStateChanged
    {
        $rejected = $commands->run(new RejectRuleProposalCommand($call->proposal, $call->reason));

        return ProposalStateChanged::from(['proposalId' => $rejected, 'state' => 'rejected']);
    }
}
