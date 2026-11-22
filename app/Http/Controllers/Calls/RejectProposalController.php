<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Processes\ProposalStateChanged;
use App\Calls\Processes\RejectProposalCall;
use App\Commands\RejectRuleProposal\RejectRuleProposalCommand;
use App\Contracts\Bus\CommandBus;

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
