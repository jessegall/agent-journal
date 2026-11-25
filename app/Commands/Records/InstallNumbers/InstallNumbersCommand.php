<?php

declare(strict_types=1);

namespace App\Commands\Records\InstallNumbers;

use App\Attributes\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;

/**
 * Creates the journal's global number group, once; running it again changes nothing.
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class InstallNumbersCommand extends Command {}
