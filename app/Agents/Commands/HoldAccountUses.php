<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Handlers\HoldAccountUsesHandler;
use App\Agents\Policies\AgentMaintenancePolicy;
use App\Agents\Support\HeldAccountUses;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Records\Support\RecordIdentity;

/**
 * Holds an account's starts for its maintenance, after its owner stopped new starts on it: it answers every start
 * still running on the account, each of which must end before the account's sign-in changes.
 *
 * @extends Command<HeldAccountUses>
 */
#[HandledBy(HoldAccountUsesHandler::class)]
#[Authorize(AgentMaintenancePolicy::class, AccessType::Edit)]
final readonly class HoldAccountUses extends Command
{
    public function __construct(public RecordIdentity $account) {}
}
