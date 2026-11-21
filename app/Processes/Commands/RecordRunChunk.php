<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Processes\Enums\OutputStream;
use App\Processes\Policies\ProcessPolicy;

/**
 * Stores one chunk of a part's spooled output once, given as its base64 bytes at its offset, its file before its row, and answers the stream's stored end in bytes; a
 * chunk the journal already holds stores nothing and answers the end it has.
 *
 * @extends Command<int>
 */
#[Authorize(ProcessPolicy::class, AccessType::Edit)]
final readonly class RecordRunChunk extends Command
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
