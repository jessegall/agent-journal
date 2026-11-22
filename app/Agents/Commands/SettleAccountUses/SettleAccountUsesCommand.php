<?php

declare(strict_types=1);

namespace App\Agents\Commands\SettleAccountUses;

use App\Agents\Policies\AgentMaintenancePolicy;
use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Records\Support\RecordIdentity;

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
