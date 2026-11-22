<?php

declare(strict_types=1);

namespace App\Commands\RecordProjectCommandProcess;

use App\Attributes\Entry;
use App\Enums\CommandEntry;
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
