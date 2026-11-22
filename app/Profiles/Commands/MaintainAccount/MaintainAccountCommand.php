<?php

declare(strict_types=1);

namespace App\Profiles\Commands\MaintainAccount;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Profiles\Policies\AccountPolicy;

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
