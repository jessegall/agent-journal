<?php

declare(strict_types=1);

namespace App\Profiles\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Profiles\Policies\AccountPolicy;

/**
 * The owner dismisses a notice about a driver's accounts; dismissing it again changes nothing.
 *
 * @extends Command<null>
 */
#[Authorize(AccountPolicy::class, AccessType::Edit)]
final readonly class DismissAccountNotice extends Command
{
    public function __construct(public string $noticeId) {}
}
