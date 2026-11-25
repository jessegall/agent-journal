<?php

declare(strict_types=1);

namespace App\Commands\Accounts\DismissAccountNotice;

use App\Attributes\Authorize;
use App\Enums\Agents\AccessType;
use App\Policies\AccountPolicy;
use App\Support\Command;

/**
 * The owner dismisses a notice about a driver's accounts; dismissing it again changes nothing.
 *
 * @extends Command<null>
 */
#[Authorize(AccountPolicy::class, AccessType::Edit)]
final readonly class DismissAccountNoticeCommand extends Command
{
    public function __construct(public string $noticeId) {}
}
