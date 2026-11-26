<?php

declare(strict_types=1);

namespace App\Commands\Hosts\RemoveHostFolder;

use App\Attributes\Commands\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;

/**
 * Orders the host to remove an account folder; the same operation asked again finds the order already made. Run for
 * the host's sign-in runner (internal, not exported).
 *
 * @extends Command<string>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class RemoveHostFolderCommand extends Command
{
    public function __construct(public string $hostId, public string $folder, public string $operation) {}
}
