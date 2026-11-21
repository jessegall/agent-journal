<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Processes\Policies\ProcessPolicy;
use App\Processes\Values\ProposalReceipt;
use App\Processes\Values\ProposedRule;

/**
 * The author of a proposal adds its next revision on top of the revision they read.
 *
 * @extends Command<ProposalReceipt>
 */
#[Authorize(ProcessPolicy::class, AccessType::Edit)]
final readonly class ReviseRuleProposal extends Command
{
    public function __construct(
        public string $proposalId,
        public int $expectedRevision,
        public ProposedRule $proposed,
    ) {}
}
