<?php

declare(strict_types=1);

namespace App\Profiles\Commands\ReleaseAccountRemoval;

use App\Bus\Attributes\Entry;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;

/**
 * Lets a host clean a removed account once no process runs on its folder: its pending starts are cancelled and its
 * running ones must have ended. Run by the journal itself (internal, not exported).
 *
 * @extends Command<bool>
 */
#[Entry(CommandEntry::AccountMaintenance)]
final readonly class ReleaseAccountRemovalCommand extends Command
{
    public function __construct(
        public string $accountId,
    ) {}
}
