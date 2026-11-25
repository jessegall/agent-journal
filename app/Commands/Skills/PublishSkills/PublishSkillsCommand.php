<?php

declare(strict_types=1);

namespace App\Commands\Skills\PublishSkills;

use App\Attributes\Commands\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;
use App\Values\PublicationClaim;

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
