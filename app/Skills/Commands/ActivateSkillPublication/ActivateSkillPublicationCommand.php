<?php

declare(strict_types=1);

namespace App\Skills\Commands\ActivateSkillPublication;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;

/**
 * The worker holding a fully staged publication switches its target to it and marks it delivered; a target already
 * on it is recorded delivered.
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::SkillPublisher)]
final readonly class ActivateSkillPublicationCommand extends Command
{
    public function __construct(
        public string $publicationId,
        public int $fence,
    ) {}
}
