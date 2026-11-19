<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Processes\Handlers\RejectRuleProposalHandler;

/**
 * A project owner rejects a proposal with a reason its author hears; the request it answered is rejected too.
 *
 * @implements Command<string>
 */
#[HandledBy(RejectRuleProposalHandler::class)]
final readonly class RejectRuleProposal implements Command
{
    public function __construct(public string $proposalId, public string $reason) {}
}
