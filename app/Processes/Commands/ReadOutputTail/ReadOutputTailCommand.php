<?php

declare(strict_types=1);

namespace App\Processes\Commands\ReadOutputTail;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Policies\ProcessPolicy;
use App\Processes\Api\OutputTail;
use App\Processes\Enums\OutputStream;
use App\Support\Command;

/**
 * Reads the last lines of one stream of a run's part and records the byte range the actor was shown.
 *
 * @extends Command<OutputTail>
 */
#[Authorize(ProcessPolicy::class, AccessType::Read)]
final readonly class ReadOutputTailCommand extends Command
{
    public function __construct(
        public string $processRunId,
        public int $part,
        public OutputStream $stream,
        public int $lines,
    ) {}
}
