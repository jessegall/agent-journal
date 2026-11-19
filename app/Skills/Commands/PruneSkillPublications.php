<?php

declare(strict_types=1);

namespace App\Skills\Commands;

use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Bus\Enums\CommandEntry;
use App\Skills\Handlers\PruneSkillPublicationsHandler;
use App\Skills\Values\PrunedPublications;

/**
 * The journal removes the staged folders no target uses any more, keeping each target's current and previous delivered
 * set, and retires publications past their retention. A folder with a hand-edited file is kept and reported.
 *
 * @extends Command<PrunedPublications>
 */
#[HandledBy(PruneSkillPublicationsHandler::class)]
#[Entry(CommandEntry::SkillPublisher)]
final readonly class PruneSkillPublications extends Command {}
