<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Enums\MenuEntryState;
use App\Agents\Policies\AgentMaintenancePolicy;
use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;

/**
 * The owner takes an entry out of the menu library: the next uncertain point of any runtime misses it and asks the
 * main agent. The entry is kept, retired.
 *
 * @extends Command<string>
 */
#[Authorize(AgentMaintenancePolicy::class, AccessType::Edit)]
final readonly class RetireMenuEntry extends Command
{
    public function __construct(
        public string $entryId,
        public MenuEntryState $expectedState,
    ) {}
}
