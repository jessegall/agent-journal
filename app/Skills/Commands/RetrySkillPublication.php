<?php

declare(strict_types=1);

namespace App\Skills\Commands;

use App\Actors\Enums\ActorType;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RequiresActor;
use App\Bus\Contracts\Command;
use App\Skills\Handlers\RetrySkillPublicationHandler;

/**
 * The journal puts a failed publication back in the queue with the same immutable generation, once its cause is
 * fixed; a changed source needs a refresh instead.
 *
 * @implements Command<null>
 */
#[HandledBy(RetrySkillPublicationHandler::class)]
#[RequiresActor(ActorType::System)]
final readonly class RetrySkillPublication implements Command
{
    public function __construct(
        public string $publicationId,
    ) {}
}
