<?php

declare(strict_types=1);

namespace App\Commands\Agents\OpenAccountOwner;

use App\Attributes\Commands\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;

/**
 * Opens the owner process that runs every headless turn of the runtime's account on its host, once the runtime's
 * start is proven and while no owner of that account and sign-in generation lives there. Answers the owner's process
 * id; none when one already lives or nothing opens. Run when work is accepted, when a start is proven and when an
 * owner ends with work left (internal, not exported).
 *
 * @extends Command<string|null>
 */
#[Entry(CommandEntry::DriverWorker)]
final readonly class OpenAccountOwnerCommand extends Command
{
    public function __construct(public string $runtimeId) {}
}
