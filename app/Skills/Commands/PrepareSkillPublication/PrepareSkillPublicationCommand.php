<?php

declare(strict_types=1);

namespace App\Skills\Commands\PrepareSkillPublication;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Skills\Values\PreparationProgress;
use App\Support\Command;

/**
 * The worker holding a publication stages its next files, at most 64, and saves how far it got.
 *
 * @extends Command<PreparationProgress>
 */
#[Entry(CommandEntry::SkillRefresh)]
final readonly class PrepareSkillPublicationCommand extends Command
{
    public function __construct(
        public string $publicationId,
        public int $fence,
    ) {}
}
