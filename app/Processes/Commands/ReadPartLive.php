<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Processes\Handlers\ReadPartLiveHandler;

/**
 * Reads a part's newly committed output with its approved reader from the reader's last position; the result is
 * provisional and never a final assessment.
 *
 * @implements Command<string>
 */
#[HandledBy(ReadPartLiveHandler::class)]
final readonly class ReadPartLive implements Command
{
    public function __construct(public string $partRunId) {}
}
