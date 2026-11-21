<?php

declare(strict_types=1);

namespace App\Profiles\Commands;

use App\Bus\Attributes\Entry;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;
use App\Profiles\Values\ReportedStart;
use App\Profiles\Values\UsageCost;

/**
 * A host reports the cost of one result it observed on a start it claimed, kept under that start's saved account. Run
 * for an authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class AddUsageCost extends Command
{
    public function __construct(public ReportedStart $start, public UsageCost $cost) {}
}
