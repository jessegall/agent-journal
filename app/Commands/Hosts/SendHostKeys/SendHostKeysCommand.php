<?php

declare(strict_types=1);

namespace App\Commands\Hosts\SendHostKeys;

use App\Attributes\Commands\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;
use App\Values\HostOrderSource;
use App\Values\RowGuard;

/**
 * Orders the host to type keys into a process's terminal, only while the rows they are meant for and the input generation are as the journal saw them; the order lapses after five seconds. Run by the journal itself (internal, not exported).
 *
 * @extends Command<string>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class SendHostKeysCommand extends Command
{
    public function __construct(
        public string $processId,
        public string $bytes,
        public RowGuard $rows,
        public int $inputGeneration,
        public HostOrderSource $source,
    ) {}
}
