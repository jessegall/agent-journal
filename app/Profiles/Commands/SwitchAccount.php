<?php

declare(strict_types=1);

namespace App\Profiles\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Profiles\Policies\AccountPolicy;

/**
 * The owner chooses the account new starts of its program use; starts already running keep theirs.
 *
 * @extends Command<null>
 */
#[Authorize(AccountPolicy::class, AccessType::Edit)]
final readonly class SwitchAccount extends Command
{
    public function __construct(public string $accountId) {}
}
