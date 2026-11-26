<?php

declare(strict_types=1);

namespace App\CommandRules\Commands\ProposeCommandRule;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\CommandRules\Values\ProposalReceipt;
use App\CommandRules\Values\ProposedRule;
use App\Policies\ProcessPolicy;
use App\Support\Command;

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
