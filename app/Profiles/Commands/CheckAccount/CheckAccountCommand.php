<?php

declare(strict_types=1);

namespace App\Profiles\Commands\CheckAccount;

use App\Bus\Attributes\Entry;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;
use App\Profiles\Enums\AccountCheckResult;

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
