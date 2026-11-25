<?php

declare(strict_types=1);

namespace App\Commands\Accounts\AddUsageCost;

use App\Attributes\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;
use App\Values\ReportedStart;
use App\Values\UsageCost;

/**
 * A host reports the cost of one result it observed on a start it claimed, kept under that start's saved account. Run
 * for an authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class AddUsageCostCommand extends Command
{
    public function __construct(public ReportedStart $start, public UsageCost $cost) {}
}
