<?php

declare(strict_types=1);

namespace App\Commands\Accounts\ReleaseAccountRemoval;

use App\Attributes\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;

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
