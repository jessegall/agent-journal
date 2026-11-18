<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Actors\Enums\ActorType;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RequiresActor;
use App\Bus\Contracts\Command;
use App\Processes\Handlers\StopSurvivorsHandler;

/**
 * A user asks that whatever of a lost run still runs on its host is stopped: its supervisor, when it reconnects,
 * starts nothing more and stops.
 *
 * @implements Command<string>
 */
#[HandledBy(StopSurvivorsHandler::class)]
#[RequiresActor(ActorType::User)]
final readonly class StopSurvivors implements Command
{
    public function __construct(public string $runId) {}
}
