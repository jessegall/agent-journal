<?php

declare(strict_types=1);

namespace App\Hosts\Commands\ClaimHostOrders;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Hosts\Values\HostOrderClaim;
use App\Support\Command;

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
