<?php

declare(strict_types=1);

namespace App\Connections\Commands;

use App\Bus\Attributes\Entry;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;
use App\Connections\Values\PresenceReceipt;
use App\Connections\Values\PresenceReport;

/**
 * A binding's relay reports it is present, with no provider session needed; only the binding's own host may.
 *
 * @extends Command<PresenceReceipt>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class RecordBindingPresence extends Command
{
    public function __construct(public string $hostId, public string $bindingId, public PresenceReport $report) {}
}
