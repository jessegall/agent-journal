<?php

declare(strict_types=1);

namespace App\Commands\Runs\RecordRunChunk;

use App\Attributes\Commands\Authorize;
use App\Enums\Agents\AccessType;
use App\Enums\Processes\OutputStream;
use App\Policies\ProcessPolicy;
use App\Support\Command;

/**
 * Stores one chunk of a part's spooled output once, given as its base64 bytes at its offset, its file before its row, and answers the stream's stored end in bytes; a
 * chunk the journal already holds stores nothing and answers the end it has.
 *
 * @extends Command<int>
 */
#[Authorize(ProcessPolicy::class, AccessType::Edit)]
final readonly class RecordRunChunkCommand extends Command
{
    public function __construct(
        public string $processRunId,
        public int $node,
        public int $attempt,
        public string $operation,
        public OutputStream $stream,
        public int $offset,
        public string $bytes,
    ) {}
}
