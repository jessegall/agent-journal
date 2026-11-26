<?php

declare(strict_types=1);

namespace App\Commands\Hosts\ReadHostFolderAnswer;

use App\Attributes\Commands\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;
use App\Values\HostFolderAnswer;

/**
 * Reads how the host answered one of its own account folder orders, for the host's sign-in runner, which reaches the
 * journal only through its signed calls (internal, not exported).
 *
 * @extends Command<HostFolderAnswer>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class ReadHostFolderAnswerCommand extends Command
{
    public function __construct(public string $hostId, public string $orderId) {}
}
