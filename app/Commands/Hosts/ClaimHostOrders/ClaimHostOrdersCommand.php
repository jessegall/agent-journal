<?php

declare(strict_types=1);

namespace App\Commands\Hosts\ClaimHostOrders;

use App\Attributes\Commands\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;
use App\Values\HostOrderClaim;

/**
 * A host takes the orders it may carry out now, oldest first per process. Run for an authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<HostOrderClaim>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class ClaimHostOrdersCommand extends Command
{
    public function __construct(
        public string $hostId,
        public int $limit,
    ) {}
}
