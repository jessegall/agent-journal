<?php

declare(strict_types=1);

namespace App\Skills\Commands;

use App\Actors\Enums\ActorType;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RequiresActor;
use App\Bus\Contracts\Command;
use App\Skills\Handlers\ActivateSkillPublicationHandler;

/**
 * The worker holding a fully staged publication switches its target to it and marks it delivered; a target already on it is recorded delivered.
 *
 * @implements Command<null>
 */
#[HandledBy(ActivateSkillPublicationHandler::class)]
#[RequiresActor(ActorType::System)]
final readonly class ActivateSkillPublication implements Command
{
    public function __construct(
        public string $publicationId,
        public int $fence,
    ) {}
}
