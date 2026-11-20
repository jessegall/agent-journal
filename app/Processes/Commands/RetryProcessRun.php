<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Processes\Handlers\RetryProcessRunHandler;
use App\Processes\Policies\ProcessPolicy;

/**
 * A user, or the actor who ran it, retries a lost run: the same line goes through a fresh admission under a new request
 * key and becomes a new run; the old admission is never run again and the old run stays lost.
 *
 * @extends Command<string>
 */
#[HandledBy(RetryProcessRunHandler::class)]
#[Authorize(ProcessPolicy::class, AccessType::Execute)]
final readonly class RetryProcessRun extends Command
{
    public function __construct(public string $runId, public string $line, public string $requestKey) {}
}
