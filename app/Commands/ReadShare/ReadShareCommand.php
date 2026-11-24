<?php

declare(strict_types=1);

namespace App\Commands\ReadShare;

use App\Attributes\Entry;
use App\Attributes\RepeatableRead;
use App\Enums\CommandEntry;
use App\Support\Command;
use App\Support\SharedPage;

/**
 * One public read of a share, run by the system for the public bridge: the permit it was given, the path from the
 * shared record, where a page of children goes on, and whether only the head is wanted.
 *
 * @extends Command<SharedPage>
 */
#[RepeatableRead]
#[Entry(CommandEntry::ShareGateway)]
final readonly class ReadShareCommand extends Command
{
    public function __construct(
        public string $permitReference,
        public string $path,
        public string|null $cursor,
        public bool $isHead,
    ) {}
}
