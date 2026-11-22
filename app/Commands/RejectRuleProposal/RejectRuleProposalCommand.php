<?php

declare(strict_types=1);

namespace App\Commands\RejectRuleProposal;

use App\Attributes\Authorize;
use App\Enums\AccessType;
use App\Policies\ProcessAdministrationPolicy;
use App\Support\Command;

/**
 * A project owner rejects a proposal with a reason its author is told; the request it answered is rejected too.
 *
 * @extends Command<string>
 */
#[Authorize(ProcessAdministrationPolicy::class, AccessType::Edit)]
final readonly class RejectRuleProposalCommand extends Command
{
    public function __construct(public string $proposalId, public string $reason) {}
}
