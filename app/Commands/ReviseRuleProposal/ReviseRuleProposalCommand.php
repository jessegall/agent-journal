<?php

declare(strict_types=1);

namespace App\Commands\ReviseRuleProposal;

use App\Attributes\Authorize;
use App\Enums\AccessType;
use App\Policies\ProcessPolicy;
use App\Support\Command;
use App\Values\ProposalReceipt;
use App\Values\ProposedRule;

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
