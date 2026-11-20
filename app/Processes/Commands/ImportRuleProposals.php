<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
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
#[Operation('import_rule_proposals', ResourceAreaType::JournalWork, AccessType::Create)]
final readonly class ImportRuleProposals extends Command implements AuthorizedCommand
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
