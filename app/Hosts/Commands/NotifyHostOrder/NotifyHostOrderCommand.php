<?php

declare(strict_types=1);

namespace App\Hosts\Commands\NotifyHostOrder;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;

/**
 * A host answers an order it claimed: carried out with its facts, or refused with its reason, sent as its JSON body. Run for an authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class NotifyHostOrderCommand extends Command
{
    public function __construct(
        public string $hostId,
        public string $orderId,
        public string $body,
    ) {}
}
