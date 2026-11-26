<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Accounts\AccountStartSettings;
use App\Asks\Contracts\AnsweredAtOnce;
use App\Support\RecordIdentity;

/**
 * A host claims a start on an account: the driver's adapter fills in what the host sets to run it on the account's
 * folder, or refuses a driver build or arrangement the real driver has not shown.
 */
final readonly class AccountSettingsRequested implements AnsweredAtOnce, SessionEvent
{
    public function __construct(
        public string $driver,
        public RecordIdentity $account,
        public string $directory,
        public AccountStartSettings $settings,
    ) {}
}
