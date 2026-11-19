<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Processes\Handlers\ApproveRuleProposalHandler;
use App\Processes\Values\ApprovalReceipt;
use App\Processes\Values\OwnerApproval;

/**
 * A project owner approves a proposal's current revision, with its proven reader when it is a test, check or build.
 *
 * @implements Command<ApprovalReceipt>
 */
#[HandledBy(ApproveRuleProposalHandler::class)]
final readonly class ApproveRuleProposal implements Command
{
    public function __construct(public string $proposalId, public OwnerApproval $approval) {}
}
