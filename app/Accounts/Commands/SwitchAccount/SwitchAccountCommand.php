<?php

declare(strict_types=1);

namespace App\Accounts\Commands\SwitchAccount;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Policies\AccountPolicy;
use App\Support\Command;

/**
 * The owner chooses the account new starts of its driver use; starts already running keep theirs. A choice made on a
 * page names the selection's change number it saw, and is refused when the selection changed since.
 *
 * @extends Command<null>
 */
#[Authorize(AccountPolicy::class, AccessType::Edit)]
final readonly class SwitchAccountCommand extends Command
{
    public function __construct(public string $accountId, public int|null $expectedChangeNumber = null) {}
}
