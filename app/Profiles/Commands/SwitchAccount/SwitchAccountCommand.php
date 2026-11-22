<?php

declare(strict_types=1);

namespace App\Profiles\Commands\SwitchAccount;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Profiles\Policies\AccountPolicy;

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
