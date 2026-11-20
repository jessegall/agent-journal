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
use App\Processes\Handlers\StopSurvivorsHandler;
use App\Processes\Models\CommandRequest;
use App\Processes\Policies\ProcessAdministrationPolicy;

/**
 * A user asks that whatever of a lost run still runs on its host is stopped: its supervisor, when it reconnects,
 * starts nothing more and stops.
 *
 * @extends Command<string>
 */
#[HandledBy(StopSurvivorsHandler::class)]
#[Authorize(ProcessAdministrationPolicy::class, ProcessAbility::Administer)]
#[Operation('stop_survivors', ResourceAreaType::JournalWork, AccessType::Edit)]
final readonly class StopSurvivors extends Command implements HasAuthorizationSubject
{
    public function __construct(public string $runId) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return CommandRequest::class;
    }
}
