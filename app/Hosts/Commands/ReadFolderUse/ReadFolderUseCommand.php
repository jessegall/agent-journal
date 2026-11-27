<?php

declare(strict_types=1);

namespace App\Hosts\Commands\ReadFolderUse;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;

/**
 * Instructs the host to say whether a container still binds an account folder; the same operation asked again finds the
 * instruction already made. Run for the host's sign-in runner (internal, not exported).
 *
 * @extends Command<string>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class ReadFolderUseCommand extends Command
{
    public function __construct(public string $hostId, public string $folder, public string $operation) {}
}
