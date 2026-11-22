<?php

declare(strict_types=1);

namespace App\Profiles\Commands\RemoveAccount;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Profiles\Policies\AccountPolicy;

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
