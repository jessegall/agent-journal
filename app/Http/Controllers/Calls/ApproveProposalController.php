<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Processes\ApproveProposalCall;
use App\Calls\Processes\RuleApproved;
use App\Commands\ApproveRuleProposal\ApproveRuleProposalCommand;
use App\Contracts\Bus\CommandBus;
use App\Values\OwnerApproval;
use App\Values\ReaderApproval;

/**
 * Approves a proposal and answers the rule it made active.
 */
final readonly class ApproveProposalController
{
    public function __invoke(ApproveProposalCall $call, CommandBus $commands): RuleApproved
    {
        $readers = $call->proof === null ? [] : [new ReaderApproval((string) $call->readerRevision, $call->proof)];
        $approval = new OwnerApproval($call->expectedRevision, $call->expectedActiveRevision, $readers, $call->reason);

        return RuleApproved::from(
            $commands->run(new ApproveRuleProposalCommand($call->proposal, $approval))->toArray(),
        );
    }
}
