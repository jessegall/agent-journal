<?php

declare(strict_types=1);

namespace App\Resolvers;

use App\Access\Contracts\CurrentAuthorizer;
use App\Accounts\AccountSessions;
use App\Accounts\AccountUseCounts;
use App\Accounts\AccountUseHistories;
use App\Accounts\Contracts\AccountUses as AccountUsesContract;
use App\Accounts\Exceptions\AccountUseMissing;
use App\Actors\Contracts\IdentityLinks;
use App\Agents\Enums\AccessType;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Models\Sessions\SessionProcess;
use App\Policies\AgentMaintenancePolicy;
use App\Support\RecordIdentity;

/**
 * Reads the uses of accounts: how many process starts on each may still have or make a process, and the history of
 * the sessions linked to an account.
 */
final readonly class AccountUses implements AccountUsesContract
{
    public function __construct(
        private AccountSessions $sessions,
        private IdentityLinks $links,
        private CurrentAuthorizer $authorizer,
    ) {}

    public function counts(array $accounts): AccountUseCounts
    {
        $this->authorizeRead();
        return new AccountUseCounts(SessionProcess::countUnresolvedByAccount($accounts));
    }

    public function histories(array $accounts, int $limit): AccountUseHistories
    {
        $this->authorizeRead();

        return $this->sessions->histories($accounts, $limit);
    }

    public function history(RecordIdentity $account, int $limit): array
    {
        $this->authorizeRead();

        $sessions = $this->sessions->all($account)
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->limit($limit)
            ->get();

        return array_values($sessions->map(fn (AgentSession $session) => $session->useOf($account))->all());
    }

    public function accountOf(string $sessionId, string $accountType): RecordIdentity
    {
        $this->authorizeRead();
        $accounts = $this->links->linkedOfType(AgentSession::findById($sessionId), $accountType);

        if (count($accounts) !== 1) {
            throw AccountUseMissing::forSession($sessionId, $accountType, count($accounts));
        }

        return $accounts[0];
    }

    private function authorizeRead(): void
    {
        $this->authorizer->authorize(AgentMaintenancePolicy::class, Agent::class, AccessType::Read);
    }
}
