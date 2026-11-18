<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Processes\Handlers\ProposeCommandRuleHandler;
use App\Processes\Values\ProposalReceipt;
use App\Processes\Values\ProposedRule;

/**
 * An agent, or a user, proposes a declaration for the command request it opened: the validated rule with its contract,
 * evidence and examples, under a request id that makes a retry return the same proposal.
 *
 * @implements Command<ProposalReceipt>
 */
#[HandledBy(ProposeCommandRuleHandler::class)]
final readonly class ProposeCommandRule implements Command
{
    public function __construct(
        public string $commandRequestId,
        public string $requestId,
        public ProposedRule $proposed,
    ) {}
}
