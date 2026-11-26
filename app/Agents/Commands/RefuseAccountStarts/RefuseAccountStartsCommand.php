<?php

declare(strict_types=1);

namespace App\Agents\Commands\RefuseAccountStarts;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;

/**
 * Refuses every unresolved start on the owner's host, account and sign-in generation as not signed in by a method the
 * journal accepts, when the owner read its account signed in another way than the account says; each refused start's
 * session ends (internal, not exported).
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::DriverWorker)]
final readonly class RefuseAccountStartsCommand extends Command
{
    public function __construct(public string $ownerProcessId) {}
}
