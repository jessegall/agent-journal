<?php

declare(strict_types=1);

namespace App\Processes\Commands\WithdrawRuleProposal;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Processes\Policies\ProcessPolicy;

/**
 * The author of a proposal takes it back before review; it stays readable as history.
 *
 * @extends Command<string>
 */
#[Authorize(ProcessPolicy::class, AccessType::Edit)]
final readonly class WithdrawRuleProposalCommand extends Command
{
    public function __construct(public string $proposalId) {}
}
