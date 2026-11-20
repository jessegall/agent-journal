<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\Operation;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use App\Processes\Enums\ProcessAbility;
use App\Processes\Handlers\StopProcessRunHandler;
use App\Processes\Models\CommandRequest;
use App\Processes\Policies\ProcessAdministrationPolicy;

/**
 * A user, or the actor who runs it, stops a run: no further part starts, and what was captured stays readable.
 *
 * @extends Command<string>
 */
#[HandledBy(StopProcessRunHandler::class)]
#[Authorize(ProcessAdministrationPolicy::class, ProcessAbility::Work)]
#[Operation('stop_process_run', ResourceAreaType::JournalWork, AccessType::Edit)]
final readonly class StopProcessRun extends Command implements HasAuthorizationSubject
{
    public function __construct(public string $runId, public string $reason) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return CommandRequest::class;
    }
}
