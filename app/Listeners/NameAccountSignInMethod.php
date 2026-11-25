<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\Events\Listener;
use App\Events\Sessions\AccountSettingsRequested;
use App\Models\Accounts\Account;

/**
 * A start on a saved account names the method that account signed in by, as it is saved, so the host knows which
 * usage its driver reports. An account that is gone names none, and its start is not claimed.
 */
final readonly class NameAccountSignInMethod implements Listener
{
    public function handle(AccountSettingsRequested $requested): void
    {
        if ($requested->account->type !== Account::linkType()) {
            return;
        }

        $method = Account::methodOf($requested->account->id);

        if ($method === null) {
            return;
        }

        $requested->settings->signInBy($method->value);
    }
}
