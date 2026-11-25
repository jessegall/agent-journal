<?php

declare(strict_types=1);

namespace App\Commands\Accounts\RecordUsageWindow;

use App\Attributes\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;
use App\Values\ReportedStart;
use App\Values\UsageWindowReading;

/**
 * A host reports a limit window it observed on a start it claimed, kept under that start's saved account. Run for an
 * authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class RecordUsageWindowCommand extends Command
{
    public function __construct(public ReportedStart $start, public UsageWindowReading $reading) {}
}
