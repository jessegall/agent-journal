<?php

declare(strict_types=1);

namespace App\Commands\Hosts\StreamHostProcess;

use App\Attributes\Commands\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;
use App\Values\HostOrderSource;

/**
 * Orders the host to send a process's screen so many times a second, changed or not; 0 ends the stream. Run by the journal itself (internal, not exported).
 *
 * @extends Command<string>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class StreamHostProcessCommand extends Command
{
    public function __construct(
        public string $processId,
        public int $framesPerSecond,
        public bool $isRaw,
        public HostOrderSource $source,
    ) {}
}
