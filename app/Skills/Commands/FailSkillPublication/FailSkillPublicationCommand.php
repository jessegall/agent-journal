<?php

declare(strict_types=1);

namespace App\Skills\Commands\FailSkillPublication;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;

/**
 * The journal records that a publication step failed, in a run of its own after the step rolled back.
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::SkillRefresh)]
final readonly class FailSkillPublicationCommand extends Command
{
    public function __construct(
        public string $publicationId,
        public string $reason,
    ) {}
}
