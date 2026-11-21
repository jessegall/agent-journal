<?php

declare(strict_types=1);

namespace App\Profiles\Commands;

use App\Bus\Attributes\Entry;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;

/**
 * A rejected sign-in was seen on an account in a sign-in generation: the host is asked to check the account, unless
 * the generation has moved on. Run by the journal itself (internal, not exported).
 *
 * @extends Command<bool>
 */
#[Entry(CommandEntry::AccountMaintenance)]
final readonly class RecordAccountFailure extends Command
{
    public function __construct(
        public string $accountId,
        public int $generation,
    ) {}
}
