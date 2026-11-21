<?php

declare(strict_types=1);

namespace App\Profiles\Listeners;

use App\Agents\Events\AccountSettingsRequested;
use App\Contracts\Listener;
use App\Profiles\Models\Account;

/**
 * A start on a saved account names the method that account signed in by, as it is saved, so the host knows which
 * usage its program reports. An account that is gone names none, and its start is not claimed.
 */
final readonly class NameAccountSignInMethod implements Listener
{
    public function handle(AccountSettingsRequested $requested): void
    {
        if ($requested->account->type !== Account::LINK_TYPE) {
            return;
        }

        $method = Account::methodOf($requested->account->id);

        if ($method === null) {
            return;
        }

        $requested->settings->signInBy($method->value);
    }
}
