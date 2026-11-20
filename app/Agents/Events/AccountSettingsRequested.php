<?php

declare(strict_types=1);

namespace App\Agents\Events;

use App\Agents\Support\AccountStartSettings;
use App\Contracts\Event;
use App\Records\Support\RecordIdentity;

/**
 * A host claims a start on an account: the program's adapter fills in what the host sets to run it on the account's
 * folder, or refuses a program build or arrangement the real program has not shown.
 */
final readonly class AccountSettingsRequested implements Event
{
    public function __construct(
        public string $program,
        public RecordIdentity $account,
        public string $directory,
        public AccountStartSettings $settings,
    ) {}
}
