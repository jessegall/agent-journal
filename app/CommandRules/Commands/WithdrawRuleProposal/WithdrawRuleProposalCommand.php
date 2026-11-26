<?php

declare(strict_types=1);

namespace App\CommandRules\Commands\WithdrawRuleProposal;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Policies\ProcessPolicy;
use App\Support\Command;

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
