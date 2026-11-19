<?php

declare(strict_types=1);

namespace App\Skills\Commands;

use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;
use App\Skills\Handlers\ActivateSkillPublicationHandler;

/**
 * The worker holding a fully staged publication switches its target to it and marks it delivered; a target already
 * on it is recorded delivered.
 *
 * @extends Command<null>
 */
#[HandledBy(ActivateSkillPublicationHandler::class)]
#[Entry(CommandEntry::SkillPublisher)]
final readonly class ActivateSkillPublication extends Command
{
    public function __construct(
        public string $publicationId,
        public int $fence,
    ) {}
}
