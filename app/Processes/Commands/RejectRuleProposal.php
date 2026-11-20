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
use App\Processes\Handlers\RejectRuleProposalHandler;
use App\Processes\Models\CommandRequest;
use App\Processes\Policies\ProcessAdministrationPolicy;

/**
 * A project owner rejects a proposal with a reason its author is told; the request it answered is rejected too.
 *
 * @extends Command<string>
 */
#[HandledBy(RejectRuleProposalHandler::class)]
#[Authorize(ProcessAdministrationPolicy::class, ProcessAbility::Administer)]
#[Operation('reject_rule_proposal', ResourceAreaType::JournalWork, AccessType::Edit)]
final readonly class RejectRuleProposal extends Command implements AuthorizedCommand
{
    public function __construct(public string $proposalId, public string $reason) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return CommandRequest::class;
    }
}
