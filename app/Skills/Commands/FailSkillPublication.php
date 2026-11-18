<?php

declare(strict_types=1);

namespace App\Skills\Commands;

use App\Actors\Enums\ActorType;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RequiresActor;
use App\Bus\Contracts\Command;
use App\Skills\Handlers\FailSkillPublicationHandler;

/**
 * The journal records that a publication step failed, in a run of its own after the step rolled back.
 *
 * @implements Command<null>
 */
#[HandledBy(FailSkillPublicationHandler::class)]
#[RequiresActor(ActorType::System)]
final readonly class FailSkillPublication implements Command
{
    public function __construct(
        public string $publicationId,
        public string $reason,
    ) {}
}
