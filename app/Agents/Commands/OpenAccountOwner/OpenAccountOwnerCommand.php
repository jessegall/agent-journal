<?php

declare(strict_types=1);

namespace App\Agents\Commands\OpenAccountOwner;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;

/**
 * Opens the owner process that runs every headless turn of the runtime's account on its host, once the start is proven
 * and no owner of that account lives there; it answers the owner's process id, or none. Run when work is accepted, a
 * start is proven or an owner ends with work left.
 *
 * @extends Command<string|null>
 */
#[Entry(CommandEntry::DriverWorker)]
final readonly class OpenAccountOwnerCommand extends Command
{
    public function __construct(public string $runtimeId) {}
}
