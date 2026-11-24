<?php

declare(strict_types=1);

namespace App\Commands\Accounts\RecordAccountFailure;

use App\Attributes\Entry;
use App\Enums\CommandEntry;
use App\Support\Command;

/**
 * A rejected sign-in was seen on an account in a sign-in generation: the host is asked to check the account, unless
 * the generation has moved on. Run by the journal itself (internal, not exported).
 *
 * @extends Command<bool>
 */
#[Entry(CommandEntry::AccountMaintenance)]
final readonly class RecordAccountFailureCommand extends Command
{
    public function __construct(
        public string $accountId,
        public int $generation,
    ) {}
}
