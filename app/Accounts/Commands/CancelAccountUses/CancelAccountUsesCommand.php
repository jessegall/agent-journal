<?php

declare(strict_types=1);

namespace App\Accounts\Commands\CancelAccountUses;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Policies\AgentMaintenancePolicy;
use App\Support\Command;
use App\Support\RecordIdentity;

/**
 * Cancels the starts of a held account that have no process yet, and answers how many it cancelled; every live
 * process of its other starts is stopped, so they end with it.
 *
 * @extends Command<int>
 */
#[Authorize(AgentMaintenancePolicy::class, AccessType::Edit)]
final readonly class CancelAccountUsesCommand extends Command
{
    public function __construct(public RecordIdentity $account) {}
}
