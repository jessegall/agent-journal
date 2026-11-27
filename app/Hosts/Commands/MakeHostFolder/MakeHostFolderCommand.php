<?php

declare(strict_types=1);

namespace App\Hosts\Commands\MakeHostFolder;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;

/**
 * Instructions the host to make an account folder for one sign-in operation; the same operation asked again finds the
 * instruction already made. Run for the host's sign-in runner (internal, not exported).
 *
 * @extends Command<string>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class MakeHostFolderCommand extends Command
{
    public function __construct(public string $hostId, public string $folder, public string $operation) {}
}
