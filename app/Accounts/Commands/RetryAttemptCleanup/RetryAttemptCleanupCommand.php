<?php

declare(strict_types=1);

namespace App\Accounts\Commands\RetryAttemptCleanup;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Policies\AccountPolicy;
use App\Support\Command;

/**
 * The owner asks the host to try the cleanup of an unfinished new account's sign-in again, by the attempt alone, as
 * no account row exists for it.
 *
 * @extends Command<null>
 */
#[Authorize(AccountPolicy::class, AccessType::Edit)]
final readonly class RetryAttemptCleanupCommand extends Command
{
    public function __construct(public string $attemptId) {}
}
