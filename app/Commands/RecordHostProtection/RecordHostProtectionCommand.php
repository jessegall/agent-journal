<?php

declare(strict_types=1);

namespace App\Commands\RecordHostProtection;

use App\Attributes\Entry;
use App\Enums\CommandEntry;
use App\Support\Command;
use App\Values\ProtectionReport;

/**
 * Keeps a contained host's latest protection report for one driver and build. Run for an authenticated host by the
 * journal itself (internal, not exported).
 *
 * @extends Command<void>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class RecordHostProtectionCommand extends Command
{
    public function __construct(
        public string $hostId,
        public ProtectionReport $report,
    ) {}
}
