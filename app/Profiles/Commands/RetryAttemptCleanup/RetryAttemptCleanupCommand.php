<?php

declare(strict_types=1);

namespace App\Profiles\Commands\RetryAttemptCleanup;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Profiles\Policies\AccountPolicy;

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
