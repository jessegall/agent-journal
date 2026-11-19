<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Processes\Enums\ProcessAbility;
use App\Processes\Handlers\RetryProcessRunHandler;
use App\Processes\Models\CommandRequest;
use App\Processes\Policies\ProcessAdministrationPolicy;

/**
 * A user, or the actor who ran it, retries a lost run: the same line goes through a fresh admission under a new request
 * key and becomes a new run; the old admission is never run again and the old run stays lost.
 *
 * @implements Command<string>
 */
#[HandledBy(RetryProcessRunHandler::class)]
#[Authorize(ProcessAdministrationPolicy::class, ProcessAbility::Work)]
final readonly class RetryProcessRun implements Command, HasAuthorizationSubject
{
    public function __construct(public string $runId, public string $line, public string $requestKey) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return CommandRequest::class;
    }
}
