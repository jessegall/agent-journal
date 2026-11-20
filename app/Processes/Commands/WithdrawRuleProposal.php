<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Processes\Handlers\WithdrawRuleProposalHandler;
use App\Processes\Policies\ProcessPolicy;

/**
 * The author of a proposal takes it back before review; it stays readable as history.
 *
 * @extends Command<string>
 */
#[HandledBy(WithdrawRuleProposalHandler::class)]
#[Authorize(ProcessPolicy::class, AccessType::Edit)]
final readonly class WithdrawRuleProposal extends Command
{
    public function __construct(public string $proposalId) {}
}
