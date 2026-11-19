<?php

declare(strict_types=1);

namespace App\Skills\Commands;

use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Bus\Enums\CommandEntry;
use App\Skills\Handlers\RetrySkillPublicationHandler;

/**
 * The journal puts a failed publication back in the queue with the same immutable generation, once its cause is
 * fixed; a changed source needs a refresh instead.
 *
 * @implements Command<null>
 */
#[HandledBy(RetrySkillPublicationHandler::class)]
#[Entry(CommandEntry::SkillPublisher)]
final readonly class RetrySkillPublication implements Command
{
    public function __construct(
        public string $publicationId,
    ) {}
}
