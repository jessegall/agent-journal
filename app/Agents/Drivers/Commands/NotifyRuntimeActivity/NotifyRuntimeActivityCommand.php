<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Commands\NotifyRuntimeActivity;

use App\Accounts\Enums\CommandEntry;
use App\Agents\Drivers\Enums\HoldReason;
use App\Attributes\Commands\Entry;
use App\Processes\Enums\RuntimeActivity;
use App\Support\Command;

/**
 * Records what a host saw a runtime do: its activity and hold in a process generation. Run for an authenticated host by
 * the journal itself (internal, not exported).
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class NotifyRuntimeActivityCommand extends Command
{
    public function __construct(
        public string $hostId,
        public string $runtimeId,
        public RuntimeActivity $activity,
        public HoldReason $hold,
        public int $processGeneration,
        /**
         * the report's place in its runtime generation's numbered reports; none from a host that numbers none
         */
        public int|null $sequence = null,
    ) {}
}
