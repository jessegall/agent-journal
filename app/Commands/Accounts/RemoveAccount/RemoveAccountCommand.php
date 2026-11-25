<?php

declare(strict_types=1);

namespace App\Commands\Accounts\RemoveAccount;

use App\Attributes\Authorize;
use App\Enums\Agents\AccessType;
use App\Policies\AccountPolicy;
use App\Support\Command;

/**
 * The owner removes a saved account: no start uses it again, no other account replaces it as the driver's choice,
 * and the host signs it out and deletes its folder once its processes ended. Removing it again changes nothing.
 *
 * @extends Command<null>
 */
#[Authorize(AccountPolicy::class, AccessType::Delete)]
final readonly class RemoveAccountCommand extends Command
{
    public function __construct(public string $accountId) {}
}
