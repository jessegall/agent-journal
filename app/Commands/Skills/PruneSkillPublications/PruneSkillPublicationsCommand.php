<?php

declare(strict_types=1);

namespace App\Commands\Skills\PruneSkillPublications;

use App\Attributes\Commands\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;
use App\Values\PrunedPublications;

/**
 * The journal removes the staged folders no target uses any more, keeping each target's current and previous delivered
 * set, and retires publications past their retention. A folder with a hand-edited file is kept and reported.
 *
 * @extends Command<PrunedPublications>
 */
#[Entry(CommandEntry::SkillPublisher)]
final readonly class PruneSkillPublicationsCommand extends Command {}
