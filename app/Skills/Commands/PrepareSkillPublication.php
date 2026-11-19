<?php

declare(strict_types=1);

namespace App\Skills\Commands;

use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Bus\Enums\CommandEntry;
use App\Skills\Handlers\PrepareSkillPublicationHandler;
use App\Skills\Values\PreparationProgress;

/**
 * The worker holding a publication stages its next files, at most 64, and saves how far it got.
 *
 * @extends Command<PreparationProgress>
 */
#[HandledBy(PrepareSkillPublicationHandler::class)]
#[Entry(CommandEntry::SkillPublisher)]
final readonly class PrepareSkillPublication extends Command
{
    public function __construct(
        public string $publicationId,
        public int $fence,
    ) {}
}
