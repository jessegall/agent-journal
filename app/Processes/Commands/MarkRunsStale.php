<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Processes\Handlers\MarkRunsStaleHandler;

/**
 * Marks every unfinished run of a project stale after its active rules changed: an admission not yet started is
 * refused, a running run starts no further part.
 *
 * @implements Command<int>
 */
#[HandledBy(MarkRunsStaleHandler::class)]
final readonly class MarkRunsStale implements Command
{
    public function __construct(public string $projectKey, public string $reason) {}
}
