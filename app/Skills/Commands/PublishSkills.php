<?php

declare(strict_types=1);

namespace App\Skills\Commands;

use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Bus\Enums\CommandEntry;
use App\Skills\Handlers\PublishSkillsHandler;
use App\Skills\Values\PublicationClaim;

/**
 * The journal claims one open publication for a worker under a new fencing version and a lease; the steps that stage
 * and activate it run as their own commands.
 *
 * @implements Command<PublicationClaim>
 */
#[HandledBy(PublishSkillsHandler::class)]
#[Entry(CommandEntry::SkillPublisher)]
final readonly class PublishSkills implements Command
{
    public function __construct(
        public string $publicationId,
        public string $holder,
    ) {}
}
