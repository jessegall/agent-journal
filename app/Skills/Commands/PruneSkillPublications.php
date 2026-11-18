<?php

declare(strict_types=1);

namespace App\Skills\Commands;

use App\Actors\Enums\ActorType;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RequiresActor;
use App\Bus\Contracts\Command;
use App\Skills\Handlers\PruneSkillPublicationsHandler;
use App\Skills\Values\PrunedPublications;

/**
 * The journal removes the staged folders no target uses any more, keeping each target's current and previous delivered
 * set, and retires publications past their retention. A folder with a hand-edited file is kept and reported.
 *
 * @implements Command<PrunedPublications>
 */
#[HandledBy(PruneSkillPublicationsHandler::class)]
#[RequiresActor(ActorType::System)]
final readonly class PruneSkillPublications implements Command {}
