<?php

declare(strict_types=1);

namespace App\Commands\Accounts\RetryAccountCleanup;

use App\Attributes\Commands\Authorize;
use App\Enums\Agents\AccessType;
use App\Policies\AccountPolicy;
use App\Support\Command;

/**
 * The owner asks the host to try a removed account's cleanup again after its tries ran out; the cleanup keeps its
 * generation and still waits until no process runs on the account.
 *
 * @extends Command<null>
 */
#[Authorize(AccountPolicy::class, AccessType::Edit)]
final readonly class RetryAccountCleanupCommand extends Command
{
    public function __construct(public string $accountId) {}
}
