<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Processes\Handlers\ReadPartLiveHandler;
use App\Processes\Policies\ProcessPolicy;

/**
 * Reads a part's newly committed output with its approved reader from the reader's last position; the result is
 * provisional and never a final assessment.
 *
 * @extends Command<string>
 */
#[HandledBy(ReadPartLiveHandler::class)]
#[Authorize(ProcessPolicy::class, AccessType::Read)]
final readonly class ReadPartLive extends Command
{
    public function __construct(public string $partRunId) {}
}
