<?php

declare(strict_types=1);

namespace App\Connections\Commands\RecordProjectCommandProcess;

use App\Bus\Attributes\Entry;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;

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
