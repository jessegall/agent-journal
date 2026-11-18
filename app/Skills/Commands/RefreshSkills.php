<?php

declare(strict_types=1);

namespace App\Skills\Commands;

use App\Actors\Enums\ActorType;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RequiresActor;
use App\Bus\Contracts\Command;
use App\Skills\Handlers\RefreshSkillsHandler;
use App\Skills\Values\RefreshResult;

/**
 * The journal checks and renders the whole catalogue as one generation, reusing the previous one when nothing changed,
 * and records a publication intent for every running session whose selection changed. Only the system runs it.
 *
 * @implements Command<RefreshResult>
 */
#[HandledBy(RefreshSkillsHandler::class)]
#[RequiresActor(ActorType::System)]
final readonly class RefreshSkills implements Command {}
