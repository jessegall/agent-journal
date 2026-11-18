<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Processes\Handlers\RetryProcessRunHandler;

/**
 * A user, or the actor who ran it, retries a lost run: the same line goes through a fresh admission under a new request
 * key and becomes a new run; the old admission is never run again and the old run stays lost.
 *
 * @implements Command<string>
 */
#[HandledBy(RetryProcessRunHandler::class)]
final readonly class RetryProcessRun implements Command
{
    public function __construct(public string $runId, public string $line, public string $requestKey) {}
}
