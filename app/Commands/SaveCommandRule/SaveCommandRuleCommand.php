<?php

declare(strict_types=1);

namespace App\Commands\SaveCommandRule;

use App\Attributes\Authorize;
use App\Enums\AccessType;
use App\Policies\ProcessAdministrationPolicy;
use App\Support\Command;
use App\Values\ApprovalReceipt;
use App\Values\ProposedRule;

/**
 * A project owner writes a declaration and approves it in one step; both the proposal and the approval are recorded
 * (story 81). A test, check or build still goes through a request, as its reader must be proven.
 *
 * @extends Command<ApprovalReceipt>
 */
#[Authorize(ProcessAdministrationPolicy::class, AccessType::Create)]
final readonly class SaveCommandRuleCommand extends Command
{
    public function __construct(
        public string $requestId,
        public ProposedRule $proposed,
        public int $expectedActiveRevision,
        public string $reason,
    ) {}
}
