<?php

declare(strict_types=1);

namespace App\Sessions;

use App\Actors\Contracts\IdentityLinks;
use App\Bus\Contracts\CommandFacts;
use App\Events\Sessions\AccountUseChanged;
use App\Models\Agents\AgentSession;
use App\Models\Sessions\SessionProcess;
use App\Sessions\Enums\TransportProfileType;
use App\Values\SelectedAccount;
use Illuminate\Container\Attributes\Config;

/**
 * Inside the start's bus transaction, links the new session to the account it runs with, once and for good, and
 * registers its process start before any process exists; both commit with the session or neither does.
 */
final readonly class RegisterPendingStart
{
    public function __construct(
        private IdentityLinks $links,
        #[Config('agents.transport_profile')]
        private string $transportProfile,
        private CommandFacts $facts,
    ) {}

    public function register(AgentSession $session, SelectedAccount $account): SessionProcess
    {
        $this->links->link($session, $account->record);
        $transport = TransportProfileType::from($this->transportProfile);
        $start = SessionProcess::create($session, $account, $transport);
        $this->facts->publishAfterCommit(new AccountUseChanged($account->record));

        return $start;
    }
}
