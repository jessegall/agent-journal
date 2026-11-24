<?php

declare(strict_types=1);

namespace App\Commands\Accounts\SettleAccountUses;

use App\Attributes\Authorize;
use App\Enums\AccessType;
use App\Policies\AgentMaintenancePolicy;
use App\Support\Command;
use App\Support\RecordIdentity;

/**
 * Confirms that every start of a held account has ended, so its owner may change the account's sign-in; it is
 * refused while one still runs.
 *
 * @extends Command<null>
 */
#[Authorize(AgentMaintenancePolicy::class, AccessType::Edit)]
final readonly class SettleAccountUsesCommand extends Command
{
    public function __construct(public RecordIdentity $account) {}
}
