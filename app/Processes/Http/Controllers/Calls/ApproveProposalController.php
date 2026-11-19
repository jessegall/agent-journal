<?php

declare(strict_types=1);

namespace App\Processes\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use App\Processes\Calls\ApproveProposalCall;
use App\Processes\Calls\RuleApproved;
use App\Processes\Commands\ApproveRuleProposal;
use App\Processes\Values\OwnerApproval;
use App\Processes\Values\ReaderApproval;

/**
 * Approves a proposal and answers the rule it made active.
 */
final readonly class ApproveProposalController
{
    public function __invoke(ApproveProposalCall $call, CommandBus $commands): RuleApproved
    {
        $readers = $call->proof === null ? [] : [new ReaderApproval((string) $call->readerRevision, $call->proof)];
        $approval = new OwnerApproval($call->expectedRevision, $call->expectedActiveRevision, $readers, $call->reason);

        return RuleApproved::from($commands->run(new ApproveRuleProposal($call->proposal, $approval))->toArray());
    }
}
