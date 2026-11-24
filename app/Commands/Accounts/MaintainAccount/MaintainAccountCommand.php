<?php

declare(strict_types=1);

namespace App\Commands\Accounts\MaintainAccount;

use App\Attributes\Authorize;
use App\Enums\AccessType;
use App\Policies\AccountPolicy;
use App\Support\Command;

/**
 * The owner holds an account before its sign-in is changed or removed: from this commit on no start selects it and
 * no new start of it is registered. Holding it again changes nothing.
 *
 * @extends Command<null>
 */
#[Authorize(AccountPolicy::class, AccessType::Edit)]
final readonly class MaintainAccountCommand extends Command
{
    public function __construct(public string $accountId) {}
}
