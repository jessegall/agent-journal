<?php

declare(strict_types=1);

namespace App\Hosts\Commands\PullHostPrivateValue;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;

/**
 * A host pulls the value of a private submission it was ordered to write, once; the value never enters an instruction.
 * Sent by an enrolled host (internal, not exported).
 *
 * @extends Command<string>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class PullHostPrivateValueCommand extends Command
{
    public function __construct(
        public string $hostId,
        public string $submissionId,
    ) {}
}
