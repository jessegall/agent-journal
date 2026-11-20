<?php

declare(strict_types=1);

namespace App\Sharing\Commands;

use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;
use App\Sharing\Handlers\ReopenSharedGatewaysHandler;

/**
 * A sharing supervisor run that just started takes the gateways over and asks to open again the endpoint of every
 * configuration that still serves a live, unexpired share; it answers how many opens it requested.
 *
 * @extends Command<int>
 */
#[Entry(CommandEntry::ShareGateway)]
#[HandledBy(ReopenSharedGatewaysHandler::class)]
final readonly class ReopenSharedGateways extends Command
{
    public function __construct(public string $runId) {}
}
