<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use App\Processes\Enums\ProcessAbility;
use App\Processes\Handlers\ImportRuleProposalsHandler;
use App\Processes\Models\CommandRequest;
use App\Processes\Policies\ProcessAdministrationPolicy;
use App\Processes\Values\ProposalReceipt;

/**
 * An agent or a user imports a repository's declaration file: its text becomes proposals awaiting review, never
 * active rules.
 *
 * @extends Command<list<ProposalReceipt>>
 */
#[HandledBy(ImportRuleProposalsHandler::class)]
#[Authorize(ProcessAdministrationPolicy::class, ProcessAbility::Work)]
final readonly class ImportRuleProposals extends Command implements HasAuthorizationSubject
{
    public function __construct(public string $declarations) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return CommandRequest::class;
    }
}
