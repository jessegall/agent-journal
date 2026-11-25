<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Api\Processes\ProposalStateChanged;
use App\Api\Processes\RejectProposalPayload;
use App\Attributes\Bus\Dispatches;
use App\Commands\CommandRules\RejectRuleProposal\RejectRuleProposalCommand;
use App\Contracts\Bus\CommandBus;

/**
 * Rejects a proposal.
 */
final readonly class RejectProposalController
{
    #[Dispatches(RejectRuleProposalCommand::class)]
    public function __invoke(RejectProposalPayload $call, CommandBus $commands): ProposalStateChanged
    {
        $rejected = $commands->run(new RejectRuleProposalCommand($call->proposal, $call->reason));

        return ProposalStateChanged::from([
            'proposalId' => $rejected,
            'state' => 'rejected',
        ]);
    }
}
