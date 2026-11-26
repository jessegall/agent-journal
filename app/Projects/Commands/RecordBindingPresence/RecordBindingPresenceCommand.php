<?php

declare(strict_types=1);

namespace App\Projects\Commands\RecordBindingPresence;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Projects\Values\PresenceReceipt;
use App\Support\Command;
use App\Values\PresenceReport;

/**
 * A binding's relay reports it is present, with no provider session needed; only the binding's own host may.
 *
 * @extends Command<PresenceReceipt>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class RecordBindingPresenceCommand extends Command
{
    public function __construct(public string $hostId, public string $bindingId, public PresenceReport $report) {}
}
