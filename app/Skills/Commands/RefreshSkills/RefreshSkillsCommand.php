<?php

declare(strict_types=1);

namespace App\Skills\Commands\RefreshSkills;

use App\Bus\Attributes\Entry;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;
use App\Skills\Values\RefreshResult;

/**
 * The journal checks and renders the whole catalogue as one generation, reusing the previous one when nothing changed,
 * and records a publication intent for every running session whose selection changed. Only the system runs it.
 *
 * @extends Command<RefreshResult>
 */
#[Entry(CommandEntry::SkillPublisher)]
final readonly class RefreshSkillsCommand extends Command {}
