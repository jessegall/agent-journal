<?php

declare(strict_types=1);

namespace App\CommandRules\Commands\ApproveRuleProposal;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\CommandRules\Values\ApprovalReceipt;
use App\CommandRules\Values\OwnerApproval;
use App\Policies\ProcessAdministrationPolicy;
use App\Support\Command;

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
