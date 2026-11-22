<?php

declare(strict_types=1);

namespace App\Processes\Commands\ApproveRuleProposal;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Processes\Policies\ProcessAdministrationPolicy;
use App\Processes\Values\ApprovalReceipt;
use App\Processes\Values\OwnerApproval;

/**
 * A project owner approves a proposal's current revision, with its proven reader when it is a test, check or build.
 *
 * @extends Command<ApprovalReceipt>
 */
#[Authorize(ProcessAdministrationPolicy::class, AccessType::Edit)]
final readonly class ApproveRuleProposalCommand extends Command
{
    public function __construct(public string $proposalId, public OwnerApproval $approval) {}
}
