<?php

declare(strict_types=1);

namespace App\Agents\Commands\ReportRuntimeActivity;

use App\Agents\Enums\HoldReason;
use App\Agents\Enums\RuntimeActivity;
use App\Bus\Attributes\Entry;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;

/**
 * Records what a host saw a runtime do: its activity and hold in a process generation. Run for an authenticated host by
 * the journal itself (internal, not exported).
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class ReportRuntimeActivityCommand extends Command
{
    public function __construct(
        public string $hostId,
        public string $runtimeId,
        public RuntimeActivity $activity,
        public HoldReason $hold,
        public int $processGeneration,
        /** the report's place in its runtime generation's numbered reports; none from a host that numbers none */
        public int|null $sequence = null,
    ) {}
}
