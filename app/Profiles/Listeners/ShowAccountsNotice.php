<?php

declare(strict_types=1);

namespace App\Profiles\Listeners;

use App\Agents\Events\ProgramFailed;
use App\Agents\Events\StartUnavailable;
use App\Contracts\Listener;
use App\Profiles\Enums\AccountNoticeReason;
use App\Profiles\Events\AccountsChanged;
use App\Profiles\Models\AccountNotice;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Turns a refused start or a failure the owner can act on into a notice on the program's accounts, from the safe
 * program and reason alone.
 */
final readonly class ShowAccountsNotice implements Listener
{
    public function __construct(private Dispatcher $events) {}

    public function handle(StartUnavailable|ProgramFailed $fact): void
    {
        $reason = $fact instanceof StartUnavailable
            ? AccountNoticeReason::forStart($fact->reason)
            : AccountNoticeReason::forFailure($fact->failure);

        if ($reason === null) {
            return;
        }

        $notice = AccountNotice::raise($fact->program, $reason);
        $this->events->dispatch(new AccountsChanged($fact->program, $notice->id));
    }
}
