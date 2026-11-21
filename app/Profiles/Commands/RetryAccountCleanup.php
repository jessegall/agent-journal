<?php

declare(strict_types=1);

namespace App\Profiles\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Profiles\Policies\AccountPolicy;

/**
 * The owner asks the host to try a removed account's cleanup again after its tries ran out; the cleanup keeps its
 * generation and still waits until no process runs on the account.
 *
 * @extends Command<null>
 */
#[Authorize(AccountPolicy::class, AccessType::Edit)]
final readonly class RetryAccountCleanup extends Command
{
    public function __construct(public string $accountId) {}
}
