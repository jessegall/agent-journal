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
use App\Processes\Handlers\ReviseRuleProposalHandler;
use App\Processes\Models\CommandRequest;
use App\Processes\Policies\ProcessAdministrationPolicy;
use App\Processes\Values\ProposalReceipt;
use App\Processes\Values\ProposedRule;

/**
 * The author of a proposal adds its next revision on top of the revision they read.
 *
 * @extends Command<ProposalReceipt>
 */
#[HandledBy(ReviseRuleProposalHandler::class)]
#[Authorize(ProcessAdministrationPolicy::class, ProcessAbility::Work)]
#[Operation('revise_rule_proposal', ResourceAreaType::JournalWork, AccessType::Edit)]
final readonly class ReviseRuleProposal extends Command implements AuthorizedCommand
{
    public function __construct(
        public string $proposalId,
        public int $expectedRevision,
        public ProposedRule $proposed,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return CommandRequest::class;
    }
}
