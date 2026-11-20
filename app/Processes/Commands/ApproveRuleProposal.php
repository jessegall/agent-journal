<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Processes\Enums\ProcessAbility;
use App\Processes\Handlers\ApproveRuleProposalHandler;
use App\Processes\Models\CommandRequest;
use App\Processes\Policies\ProcessAdministrationPolicy;
use App\Processes\Values\ApprovalReceipt;
use App\Processes\Values\OwnerApproval;

/**
 * A project owner approves a proposal's current revision, with its proven reader when it is a test, check or build.
 *
 * @extends Command<ApprovalReceipt>
 */
#[HandledBy(ApproveRuleProposalHandler::class)]
#[Authorize(ProcessAdministrationPolicy::class, ProcessAbility::Administer)]
#[Operation('approve_rule_proposal', ResourceAreaType::JournalWork, AccessType::Edit)]
final readonly class ApproveRuleProposal extends Command implements AuthorizedCommand
{
    public function __construct(public string $proposalId, public OwnerApproval $approval) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return CommandRequest::class;
    }
}
