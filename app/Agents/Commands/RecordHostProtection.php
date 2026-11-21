<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Handlers\RecordHostProtectionHandler;
use App\Agents\Values\ProtectionReport;
use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;

/**
 * Keeps a contained host's latest protection report for one program and build. Run for an authenticated host by the
 * journal itself (internal, not exported).
 *
 * @extends Command<void>
 */
#[Entry(CommandEntry::HostControl)]
#[HandledBy(RecordHostProtectionHandler::class)]
final readonly class RecordHostProtection extends Command
{
    public function __construct(
        public string $hostId,
        public ProtectionReport $report,
    ) {}
}
