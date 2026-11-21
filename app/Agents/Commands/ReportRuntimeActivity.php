<?php

declare(strict_types=1);

namespace App\Agents\Commands;

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
final readonly class ReportRuntimeActivity extends Command
{
    public function __construct(
        public string $hostId,
        public string $runtimeId,
        public RuntimeActivity $activity,
        public HoldReason $hold,
        public int $processGeneration,
    ) {}
}
