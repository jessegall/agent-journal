<?php

declare(strict_types=1);

namespace App\Commands\Projects\CancelProjectCommandRun;

use App\Attributes\Commands\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;

/**
 * A connected machine cancels the journal verb it started under this request id: its process is stopped.
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class CancelProjectCommandRunCommand extends Command
{
    public function __construct(public string $requestKey, public string $agentId) {}
}
