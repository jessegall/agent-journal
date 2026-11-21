<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Processes\Policies\ProcessAdministrationPolicy;

/**
 * A project owner rejects a proposal with a reason its author is told; the request it answered is rejected too.
 *
 * @extends Command<string>
 */
#[Authorize(ProcessAdministrationPolicy::class, AccessType::Edit)]
final readonly class RejectRuleProposal extends Command
{
    public function __construct(public string $proposalId, public string $reason) {}
}
