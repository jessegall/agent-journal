<?php

declare(strict_types=1);

namespace App\Hosts\Commands\ReserveHostDriverImages;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;

/**
 * Reserves on a contained host one driver image row for each distinct recipe of the deployed drivers, so the host
 * builds each once, and answers how many rows the host keeps. Run by the journal itself when the host claims its
 * instructions (internal, not exported).
 *
 * @extends Command<int>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class ReserveHostDriverImagesCommand extends Command
{
    public function __construct(public string $hostId) {}
}
