<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\IdentityLinks;
use App\Contracts\Bus\CommandFacts;
use App\Enums\TransportProfileType;
use App\Events\AccountUseChanged;
use App\Models\AgentSession;
use App\Models\ProcessStart;
use App\Values\SelectedAccount;
use Illuminate\Contracts\Config\Repository;

/**
 * Inside the start's bus transaction, links the new session to the account it runs with, once and for good, and
 * registers its process start before any process exists; both commit with the session or neither does.
 */
final readonly class RegisterPendingStart
{
    public function __construct(
        private IdentityLinks $links,
        private Repository $config,
        private CommandFacts $facts,
    ) {}

    public function register(AgentSession $session, SelectedAccount $account): ProcessStart
    {
        $this->links->link($session, $account->record);
        $transport = TransportProfileType::from($this->config->string('agents.transport_profile'));
        $start = ProcessStart::create($session, $account, $transport);
        $this->facts->publishAfterCommit(new AccountUseChanged($account->record));

        return $start;
    }
}
