<?php

declare(strict_types=1);

namespace App\Hosts\Commands\NotifyHostOutput;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;

/**
 * A host sends what one of its processes printed, as its JSON body. Run for an authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class NotifyHostOutputCommand extends Command
{
    public function __construct(
        public string $hostId,
        public string $processId,
        public string $body,
    ) {}
}
