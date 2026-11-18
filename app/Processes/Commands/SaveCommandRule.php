<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Actors\Enums\ActorType;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RequiresActor;
use App\Bus\Contracts\Command;
use App\Processes\Handlers\SaveCommandRuleHandler;
use App\Processes\Values\ApprovalReceipt;
use App\Processes\Values\ProposedRule;

/**
 * A project owner writes a declaration and approves it in one step; both the proposal and the approval are recorded
 * (story 81). A test, check or build still goes through a request, as its reader must be proven.
 *
 * @implements Command<ApprovalReceipt>
 */
#[HandledBy(SaveCommandRuleHandler::class)]
#[RequiresActor(ActorType::User)]
final readonly class SaveCommandRule implements Command
{
    public function __construct(
        public string $requestId,
        public ProposedRule $proposed,
        public int $expectedActiveRevision,
        public string $reason,
    ) {}
}
