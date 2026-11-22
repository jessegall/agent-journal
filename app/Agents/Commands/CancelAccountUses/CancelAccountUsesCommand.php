<?php

declare(strict_types=1);

namespace App\Agents\Commands\CancelAccountUses;

use App\Agents\Policies\AgentMaintenancePolicy;
use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Records\Support\RecordIdentity;

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
