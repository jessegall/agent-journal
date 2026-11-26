<?php

declare(strict_types=1);

namespace App\Projects\Commands\RecordProjectCommandProcess;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;

/**
 * Records the process a journal verb's run started, so a cancel of its request id can stop it.
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class RecordProjectCommandProcessCommand extends Command
{
    public function __construct(public string $requestKey, public int $pid) {}
}
