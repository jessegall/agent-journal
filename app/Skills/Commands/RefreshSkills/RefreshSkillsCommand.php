<?php

declare(strict_types=1);

namespace App\Skills\Commands\RefreshSkills;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Skills\Values\RefreshResult;
use App\Support\Command;

/**
 * The journal checks and renders the whole catalogue as one generation, reusing the previous one when nothing changed,
 * and records a publication intent for every running session whose selection changed. Only the system runs it.
 *
 * @extends Command<RefreshResult>
 */
#[Entry(CommandEntry::SkillRefresh)]
final readonly class RefreshSkillsCommand extends Command {}
