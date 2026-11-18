<?php

declare(strict_types=1);

namespace App\Web\Commands;

use App\Actors\Enums\ActorType;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RequiresActor;
use App\Bus\Contracts\Command;
use App\Web\Handlers\RecordUserHeartbeatHandler;

/**
 * Records a heartbeat of the calling user at the database server's time; the user comes from the current actor.
 *
 * @implements Command<null>
 */
#[HandledBy(RecordUserHeartbeatHandler::class)]
#[RequiresActor(ActorType::User)]
final readonly class RecordUserHeartbeat implements Command {}
