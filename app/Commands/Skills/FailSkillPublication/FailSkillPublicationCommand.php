<?php

declare(strict_types=1);

namespace App\Commands\Skills\FailSkillPublication;

use App\Attributes\Commands\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;

/**
 * The journal records that a publication step failed, in a run of its own after the step rolled back.
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::SkillPublisher)]
final readonly class FailSkillPublicationCommand extends Command
{
    public function __construct(
        public string $publicationId,
        public string $reason,
    ) {}
}
