<?php

declare(strict_types=1);

namespace App\CommandRules\Commands\ReviseRuleProposal;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\CommandRules\Values\ProposalReceipt;
use App\CommandRules\Values\ProposedRule;
use App\Policies\ProcessPolicy;
use App\Support\Command;

/**
 * The author of a proposal adds its next revision on top of the revision they read.
 *
 * @extends Command<ProposalReceipt>
 */
#[Authorize(ProcessPolicy::class, AccessType::Edit)]
final readonly class ReviseRuleProposalCommand extends Command
{
    public function __construct(
        public string $proposalId,
        public int $expectedRevision,
        public ProposedRule $proposed,
    ) {}
}
