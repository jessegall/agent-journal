<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Processes\Handlers\StopProcessRunHandler;

/**
 * A user, or the actor who runs it, stops a run: no further part starts, and what was captured stays readable.
 *
 * @implements Command<string>
 */
#[HandledBy(StopProcessRunHandler::class)]
final readonly class StopProcessRun implements Command
{
    public function __construct(public string $runId, public string $reason) {}
}
