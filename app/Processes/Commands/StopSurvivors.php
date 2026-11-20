<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Processes\Handlers\StopSurvivorsHandler;
use App\Processes\Policies\ProcessAdministrationPolicy;

/**
 * A user asks that whatever of a lost run still runs on its host is stopped: its supervisor, when it reconnects,
 * starts nothing more and stops.
 *
 * @extends Command<string>
 */
#[HandledBy(StopSurvivorsHandler::class)]
#[Authorize(ProcessAdministrationPolicy::class, AccessType::Edit)]
final readonly class StopSurvivors extends Command
{
    public function __construct(public string $runId) {}
}
