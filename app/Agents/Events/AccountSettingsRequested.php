<?php

declare(strict_types=1);

namespace App\Agents\Events;

use App\Agents\Support\AccountLaunchSettings;
use App\Contracts\Event;

/**
 * A host claims a start on an account: the program's adapter fills in what the host sets to run it on the account's
 * folder, or refuses a program build or arrangement the real program has not shown.
 */
final readonly class AccountSettingsRequested implements Event
{
    public function __construct(
        public string $program,
        public string $directory,
        public AccountLaunchSettings $settings,
    ) {}
}
