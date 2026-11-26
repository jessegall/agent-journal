<?php

declare(strict_types=1);

namespace App\Commands\Hosts\WriteHostInput;

use App\Attributes\Commands\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;
use App\Values\HostOrderSource;

/**
 * Orders the host to write bytes to a pipe process's standard input. Run by the journal itself (internal, not exported).
 *
 * @extends Command<string>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class WriteHostInputCommand extends Command
{
    public function __construct(
        public string $processId,
        public string $bytes,
        public HostOrderSource $source,
    ) {}
}
