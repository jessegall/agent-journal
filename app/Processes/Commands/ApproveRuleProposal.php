<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Processes\Enums\ProcessAbility;
use App\Processes\Handlers\ApproveRuleProposalHandler;
use App\Processes\Models\CommandRequest;
use App\Processes\Policies\ProcessAdministrationPolicy;
use App\Processes\Values\ApprovalReceipt;
use App\Processes\Values\OwnerApproval;

/**
 * A project owner approves a proposal's current revision, with its proven reader when it is a test, check or build.
 *
 * @implements Command<ApprovalReceipt>
 */
#[HandledBy(ApproveRuleProposalHandler::class)]
#[Authorize(ProcessAdministrationPolicy::class, ProcessAbility::Administer)]
final readonly class ApproveRuleProposal implements Command, HasAuthorizationSubject
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
