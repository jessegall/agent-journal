<?php

declare(strict_types=1);

namespace App\Skills\Commands\PublishSkills;

use App\Bus\Attributes\Entry;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;
use App\Skills\Values\PublicationClaim;

/**
 * The journal claims one open publication for a worker under a new fencing version and a lease; the steps that stage
 * and activate it run as their own commands.
 *
 * @extends Command<PublicationClaim>
 */
#[Entry(CommandEntry::SkillPublisher)]
final readonly class PublishSkillsCommand extends Command
{
    public function __construct(
        public string $publicationId,
        public string $holder,
    ) {}
}
