<?php

declare(strict_types=1);

namespace App\Commands\PrepareSkillPublication;

use App\Attributes\Entry;
use App\Enums\CommandEntry;
use App\Support\Command;
use App\Values\PreparationProgress;

/**
 * The worker holding a publication stages its next files, at most 64, and saves how far it got.
 *
 * @extends Command<PreparationProgress>
 */
#[Entry(CommandEntry::SkillPublisher)]
final readonly class PrepareSkillPublicationCommand extends Command
{
    public function __construct(
        public string $publicationId,
        public int $fence,
    ) {}
}
