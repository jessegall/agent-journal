<?php

declare(strict_types=1);

namespace App\Profiles\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Profiles\Handlers\RemoveAccountHandler;
use App\Profiles\Policies\AccountPolicy;

/**
 * The owner removes a saved account: no start uses it again, no other account replaces it as the program's choice,
 * and the host signs it out and deletes its folder once its processes ended. Removing it again changes nothing.
 *
 * @extends Command<null>
 */
#[HandledBy(RemoveAccountHandler::class)]
#[Authorize(AccountPolicy::class, AccessType::Delete)]
final readonly class RemoveAccount extends Command
{
    public function __construct(public string $accountId) {}
}
