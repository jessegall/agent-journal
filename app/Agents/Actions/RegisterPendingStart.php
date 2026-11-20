<?php

declare(strict_types=1);

namespace App\Agents\Actions;

use App\Agents\Enums\TransportProfileType;
use App\Agents\Events\AccountUseChanged;
use App\Agents\Models\AgentSession;
use App\Agents\Models\ProcessStart;
use App\Agents\Support\SelectedAccount;
use App\Records\Contracts\IdentityLinks;
use Illuminate\Contracts\Config\Repository;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Inside the start's bus transaction, links the new session to the account it runs with, once and for good, and
 * registers its process start before any process exists; both commit with the session or neither does.
 */
final readonly class RegisterPendingStart
{
    public function __construct(
        private IdentityLinks $links,
        private Dispatcher $events,
        private Repository $config,
    ) {}

    public function register(AgentSession $session, SelectedAccount $account): ProcessStart
    {
        $this->links->link($session, $account->record);
        $transport = TransportProfileType::from($this->config->string('agents.transport_profile'));
        $start = ProcessStart::create($session, $account, $transport);
        $this->events->dispatch(new AccountUseChanged($account->record));

        return $start;
    }
}
