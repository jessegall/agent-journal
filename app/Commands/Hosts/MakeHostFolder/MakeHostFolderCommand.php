<?php

declare(strict_types=1);

namespace App\Commands\Hosts\MakeHostFolder;

use App\Attributes\Commands\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;

/**
 * Orders the host to make an account folder for one sign-in operation; the same operation asked again finds the
 * order already made. Run for the host's sign-in runner (internal, not exported).
 *
 * @extends Command<string>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class MakeHostFolderCommand extends Command
{
    public function __construct(public string $hostId, public string $folder, public string $operation) {}
}
