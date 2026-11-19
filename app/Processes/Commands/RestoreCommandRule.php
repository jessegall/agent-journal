<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Processes\Enums\ProcessAbility;
use App\Processes\Handlers\RestoreCommandRuleHandler;
use App\Processes\Models\CommandRequest;
use App\Processes\Policies\ProcessAdministrationPolicy;
use App\Processes\Values\ProposalReceipt;

/**
 * A project owner restores an earlier approved revision of a rule: it becomes a new proposal that still needs
 * approval.
 *
 * @extends Command<ProposalReceipt>
 */
#[HandledBy(RestoreCommandRuleHandler::class)]
#[Authorize(ProcessAdministrationPolicy::class, ProcessAbility::Administer)]
final readonly class RestoreCommandRule extends Command implements HasAuthorizationSubject
{
    public function __construct(
        public string $classificationRuleId,
        public int $fromRevision,
        public int $expectedRevision,
        public string $requestId,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return CommandRequest::class;
    }
}
