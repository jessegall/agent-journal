<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Processes\Handlers\ReviseRuleProposalHandler;
use App\Processes\Values\ProposalReceipt;
use App\Processes\Values\ProposedRule;

/**
 * The author of a proposal adds its next revision on top of the revision they read.
 *
 * @implements Command<ProposalReceipt>
 */
#[HandledBy(ReviseRuleProposalHandler::class)]
final readonly class ReviseRuleProposal implements Command
{
    public function __construct(
        public string $proposalId,
        public int $expectedRevision,
        public ProposedRule $proposed,
    ) {}
}
