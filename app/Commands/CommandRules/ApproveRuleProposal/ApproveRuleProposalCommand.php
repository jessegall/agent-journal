<?php

declare(strict_types=1);

namespace App\Commands\CommandRules\ApproveRuleProposal;

use App\Attributes\Authorize;
use App\Enums\Agents\AccessType;
use App\Policies\ProcessAdministrationPolicy;
use App\Support\Command;
use App\Values\ApprovalReceipt;
use App\Values\OwnerApproval;

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
