<?php

declare(strict_types=1);

namespace App\Skills\Commands\RetrySkillPublication;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;

/**
 * The journal puts a failed publication back in the queue with the same immutable generation, once its cause is
 * fixed; a changed source needs a refresh instead.
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::SkillPublisher)]
final readonly class RetrySkillPublicationCommand extends Command
{
    public function __construct(
        public string $publicationId,
    ) {}
}
