<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Processes\Handlers\SaveCommandRuleHandler;
use App\Processes\Policies\ProcessAdministrationPolicy;
use App\Processes\Values\ApprovalReceipt;
use App\Processes\Values\ProposedRule;

/**
 * A project owner writes a declaration and approves it in one step; both the proposal and the approval are recorded
 * (story 81). A test, check or build still goes through a request, as its reader must be proven.
 *
 * @extends Command<ApprovalReceipt>
 */
#[HandledBy(SaveCommandRuleHandler::class)]
#[Authorize(ProcessAdministrationPolicy::class, AccessType::Create)]
final readonly class SaveCommandRule extends Command
{
    public function __construct(
        public string $requestId,
        public ProposedRule $proposed,
        public int $expectedActiveRevision,
        public string $reason,
    ) {}
}
