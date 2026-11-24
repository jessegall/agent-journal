<?php

declare(strict_types=1);

namespace App\Commands\Accounts\CleanAccount;

use App\Attributes\Entry;
use App\Enums\CommandEntry;
use App\Support\Command;
use App\Values\CleanupProgress;

/**
 * The host reports what it proved of a removed account's cleanup in the generation it was asked in: its sign-in
 * store gone and its folder gone, as two proofs. Run for an authenticated host by the journal itself (internal, not
 * exported).
 *
 * @extends Command<bool>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class CleanAccountCommand extends Command
{
    public function __construct(
        public string $hostId,
        public string $accountId,
        public int $generation,
        public CleanupProgress $progress,
    ) {}
}
