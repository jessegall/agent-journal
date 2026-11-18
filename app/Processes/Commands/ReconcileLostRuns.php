<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Actors\Enums\ActorType;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RequiresActor;
use App\Bus\Contracts\Command;
use App\Processes\Handlers\ReconcileLostRunsHandler;

/**
 * The journal marks the runs whose supervisor fell silent as lost.
 *
 * @implements Command<int>
 */
#[HandledBy(ReconcileLostRunsHandler::class)]
#[RequiresActor(ActorType::System)]
final readonly class ReconcileLostRuns implements Command {}
