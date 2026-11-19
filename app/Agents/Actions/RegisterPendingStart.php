<?php

declare(strict_types=1);

namespace App\Agents\Actions;

use App\Agents\Events\AccountUseChanged;
use App\Agents\Models\AgentSession;
use App\Agents\Models\ProcessStart;
use App\Agents\Support\SelectedAccount;
use App\Records\Contracts\IdentityLinks;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Inside the start's bus transaction, links the new session to the account it runs with, once and for good, and
 * registers its process start before any process exists; both commit with the session or neither does.
 */
final readonly class RegisterPendingStart
{
    public function __construct(private IdentityLinks $links, private Dispatcher $events) {}

    public function register(AgentSession $session, SelectedAccount $account): ProcessStart
    {
        $this->links->link($session, $account->record);
        $start = ProcessStart::register($session, $account);
        $this->events->dispatch(new AccountUseChanged($account->record));

        return $start;
    }
}
