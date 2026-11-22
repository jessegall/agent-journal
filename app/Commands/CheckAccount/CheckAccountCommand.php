<?php

declare(strict_types=1);

namespace App\Commands\CheckAccount;

use App\Attributes\Entry;
use App\Enums\AccountCheckResult;
use App\Enums\CommandEntry;
use App\Support\Command;

/**
 * The host reports what the driver's own check of an account said, made outside any transaction in the generation
 * it was asked for. Run for an authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class CheckAccountCommand extends Command
{
    public function __construct(
        public string $hostId,
        public string $accountId,
        public int $generation,
        public AccountCheckResult $accountCheck,
    ) {}
}
