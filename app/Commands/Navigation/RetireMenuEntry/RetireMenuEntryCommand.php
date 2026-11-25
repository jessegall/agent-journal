<?php

declare(strict_types=1);

namespace App\Commands\Navigation\RetireMenuEntry;

use App\Attributes\Authorize;
use App\Enums\Agents\AccessType;
use App\Enums\Navigation\MenuEntryState;
use App\Policies\AgentMaintenancePolicy;
use App\Support\Command;

/**
 * The owner takes an entry out of the menu library: the next uncertain point of any runtime misses it and asks the
 * main agent. The entry is kept, retired.
 *
 * @extends Command<string>
 */
#[Authorize(AgentMaintenancePolicy::class, AccessType::Edit)]
final readonly class RetireMenuEntryCommand extends Command
{
    public function __construct(
        public string $entryId,
        public MenuEntryState $expectedState,
    ) {}
}
