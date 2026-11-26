<?php

declare(strict_types=1);

namespace App\CommandRules\Commands\ProposeRuleDeclaration;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\CommandRules\Values\ProposalReceipt;
use App\Policies\ProcessPolicy;
use App\Support\Command;

/**
 * An agent proposes a declaration for the command request it opened, sent as the JSON text of a declaration file
 * holding it alone and read before it is proposed; its request id makes a retry return the same proposal.
 *
 * @extends Command<ProposalReceipt>
 */
#[Authorize(ProcessPolicy::class, AccessType::Create)]
final readonly class ProposeRuleDeclarationCommand extends Command
{
    public function __construct(
        public string $commandRequestId,
        public string $declarationFile,
    ) {}
}
