<?php

declare(strict_types=1);

namespace App\Connections\Commands;

use App\Bus\Attributes\Entry;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;

/**
 * A connected machine cancels the journal verb it started under this request id: its process is stopped.
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class CancelProjectCommandRun extends Command
{
    public function __construct(public string $requestId, public string $agentId) {}
}
