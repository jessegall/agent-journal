<?php

declare(strict_types=1);

namespace App\Commands\Accounts\CancelAccountUses;

use App\Attributes\Authorize;
use App\Enums\AccessType;
use App\Policies\AgentMaintenancePolicy;
use App\Support\Command;
use App\Support\RecordIdentity;

/**
 * Cancels the starts of a held account that have no process yet, and answers how many it cancelled.
 *
 * @extends Command<int>
 */
#[Authorize(AgentMaintenancePolicy::class, AccessType::Edit)]
final readonly class CancelAccountUsesCommand extends Command
{
    public function __construct(public RecordIdentity $account) {}
}
