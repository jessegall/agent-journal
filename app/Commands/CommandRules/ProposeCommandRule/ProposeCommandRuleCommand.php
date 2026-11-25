<?php

declare(strict_types=1);

namespace App\Commands\CommandRules\ProposeCommandRule;

use App\Attributes\Authorize;
use App\Enums\Agents\AccessType;
use App\Policies\ProcessPolicy;
use App\Support\Command;
use App\Values\ProposalReceipt;
use App\Values\ProposedRule;

/**
 * An agent, or a user, proposes a declaration for the command request it opened: the validated rule with its contract,
 * evidence and examples, under a request id that makes a retry return the same proposal.
 *
 * @extends Command<ProposalReceipt>
 */
#[Authorize(ProcessPolicy::class, AccessType::Create)]
final readonly class ProposeCommandRuleCommand extends Command
{
    public function __construct(
        public string $commandRequestId,
        public string $requestId,
        public ProposedRule $proposed,
    ) {}
}
