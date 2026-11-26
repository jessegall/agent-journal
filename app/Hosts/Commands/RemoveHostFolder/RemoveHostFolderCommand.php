<?php

declare(strict_types=1);

namespace App\Hosts\Commands\RemoveHostFolder;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
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
