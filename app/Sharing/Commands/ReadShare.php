<?php

declare(strict_types=1);

namespace App\Sharing\Commands;

use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Support\Command;
use App\Bus\Enums\CommandEntry;
use App\Sharing\Handlers\ReadShareHandler;
use App\Sharing\Support\SharedPage;

/**
 * One public read of a share, run by the system for the public bridge: the permit it was given, the path from the
 * shared record, where a page of children goes on, and whether only the head is wanted.
 *
 * @extends Command<SharedPage>
 */
#[HandledBy(ReadShareHandler::class)]
#[Entry(CommandEntry::ShareGateway)]
#[RepeatableRead]
final readonly class ReadShare extends Command
{
    public function __construct(
        public string $permitReference,
        public string $path,
        public string|null $cursor,
        public bool $head,
    ) {}
}
