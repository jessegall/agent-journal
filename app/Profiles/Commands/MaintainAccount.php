<?php

declare(strict_types=1);

namespace App\Profiles\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Profiles\Handlers\MaintainAccountHandler;
use App\Profiles\Policies\AccountPolicy;

/**
 * The owner holds an account before its sign-in is changed or removed: from this commit on no start selects it and
 * no new start of it is registered. Holding it again changes nothing.
 *
 * @extends Command<null>
 */
#[HandledBy(MaintainAccountHandler::class)]
#[Authorize(AccountPolicy::class, AccessType::Edit)]
final readonly class MaintainAccount extends Command
{
    public function __construct(public string $accountId) {}
}
