<?php

declare(strict_types=1);

namespace App\Commands\Accounts\HoldAccountUses;

use App\Attributes\Commands\Authorize;
use App\Enums\Agents\AccessType;
use App\Policies\AgentMaintenancePolicy;
use App\Support\Command;
use App\Support\HeldAccountUses;
use App\Support\RecordIdentity;

/**
 * Holds an account's starts for its maintenance, after its owner stopped new starts on it: it answers every start
 * still running on the account, each of which must end before the account's sign-in changes.
 *
 * @extends Command<HeldAccountUses>
 */
#[Authorize(AgentMaintenancePolicy::class, AccessType::Edit)]
final readonly class HoldAccountUsesCommand extends Command
{
    public function __construct(public RecordIdentity $account) {}
}
