<?php

declare(strict_types=1);

namespace App\Commands\Runs\ReadOutputTail;

use App\Api\Processes\OutputTail;
use App\Attributes\Commands\Authorize;
use App\Enums\Agents\AccessType;
use App\Enums\Processes\OutputStream;
use App\Policies\ProcessPolicy;
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
