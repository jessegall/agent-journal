<?php

declare(strict_types=1);

namespace App\Skills\Commands;

use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;
use App\Skills\Handlers\FailSkillPublicationHandler;

/**
 * The journal records that a publication step failed, in a run of its own after the step rolled back.
 *
 * @extends Command<null>
 */
#[HandledBy(FailSkillPublicationHandler::class)]
#[Entry(CommandEntry::SkillPublisher)]
final readonly class FailSkillPublication extends Command
{
    public function __construct(
        public string $publicationId,
        public string $reason,
    ) {}
}
