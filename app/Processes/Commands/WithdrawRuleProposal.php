<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Processes\Handlers\WithdrawRuleProposalHandler;

/**
 * The author of a proposal takes it back before review; it stays readable as history.
 *
 * @implements Command<string>
 */
#[HandledBy(WithdrawRuleProposalHandler::class)]
final readonly class WithdrawRuleProposal implements Command
{
    public function __construct(public string $proposalId) {}
}
