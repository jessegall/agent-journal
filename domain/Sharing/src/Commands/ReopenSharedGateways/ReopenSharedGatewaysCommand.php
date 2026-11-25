<?php

declare(strict_types=1);

namespace Domain\Sharing\Commands\ReopenSharedGateways;

use App\Attributes\Commands\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;

/**
 * A sharing supervisor run that just started takes the gateways over and asks to open again the endpoint of every
 * configuration that still serves a live, unexpired share; it answers how many opens it requested.
 *
 * @extends Command<int>
 */
#[Entry(CommandEntry::ShareGateway)]
final readonly class ReopenSharedGatewaysCommand extends Command
{
    public function __construct(public string $runId) {}
}
