<?php

declare(strict_types=1);

namespace App\Commands\Hosts\PullHostPrivateValue;

use App\Attributes\Commands\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;

/**
 * A host pulls the value of a private submission it was ordered to write, once; the value never enters an order.
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
