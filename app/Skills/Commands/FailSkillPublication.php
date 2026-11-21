<?php

declare(strict_types=1);

namespace App\Skills\Commands;

use App\Bus\Attributes\Entry;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;

/**
 * The journal records that a publication step failed, in a run of its own after the step rolled back.
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::SkillPublisher)]
final readonly class FailSkillPublication extends Command
{
    public function __construct(
        public string $publicationId,
        public string $reason,
    ) {}
}
