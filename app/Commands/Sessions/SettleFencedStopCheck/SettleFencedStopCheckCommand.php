<?php

declare(strict_types=1);

namespace App\Commands\Sessions\SettleFencedStopCheck;

use App\Attributes\Commands\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;

/**
 * Settles the stop attempt whose conditions ran under the run_fenced order by the host's answer to it. Run by the
 * journal itself when the host answers or refuses the order (internal, not exported).
 *
 * @extends Command<void>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class SettleFencedStopCheckCommand extends Command
{
    public function __construct(public string $orderId) {}
}
