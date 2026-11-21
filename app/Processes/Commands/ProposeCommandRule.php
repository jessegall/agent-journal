<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Processes\Policies\ProcessPolicy;
use App\Processes\Values\ProposalReceipt;
use App\Processes\Values\ProposedRule;

/**
 * An agent, or a user, proposes a declaration for the command request it opened: the validated rule with its contract,
 * evidence and examples, under a request id that makes a retry return the same proposal.
 *
 * @extends Command<ProposalReceipt>
 */
#[Authorize(ProcessPolicy::class, AccessType::Create)]
final readonly class ProposeCommandRule extends Command
{
    public function __construct(
        public string $commandRequestId,
        public string $requestId,
        public ProposedRule $proposed,
    ) {}
}
