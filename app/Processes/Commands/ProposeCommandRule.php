<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Processes\Enums\ProcessAbility;
use App\Processes\Handlers\ProposeCommandRuleHandler;
use App\Processes\Models\CommandRequest;
use App\Processes\Policies\ProcessAdministrationPolicy;
use App\Processes\Values\ProposalReceipt;
use App\Processes\Values\ProposedRule;

/**
 * An agent, or a user, proposes a declaration for the command request it opened: the validated rule with its contract,
 * evidence and examples, under a request id that makes a retry return the same proposal.
 *
 * @extends Command<ProposalReceipt>
 */
#[HandledBy(ProposeCommandRuleHandler::class)]
#[Authorize(ProcessAdministrationPolicy::class, ProcessAbility::Work)]
final readonly class ProposeCommandRule extends Command implements HasAuthorizationSubject
{
    public function __construct(
        public string $commandRequestId,
        public string $requestId,
        public ProposedRule $proposed,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return CommandRequest::class;
    }
}
