<?php

declare(strict_types=1);

namespace App\Resolvers;

use App\Contracts\Accounts\AccountUses;
use App\Contracts\Actors\IdentityLinks;
use App\Contracts\Authorization\CurrentAuthorizer;
use App\Enums\AccessType;
use App\Exceptions\AccountUseMissing;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Models\Starts\ProcessStart;
use App\Policies\AgentMaintenancePolicy;
use App\Support\AccountSessions;
use App\Support\AccountUseCounts;
use App\Support\RecordIdentity;

/**
 * Reads the uses of accounts: how many process starts on each may still have or make a process, and the history of
 * the sessions linked to an account.
 */
final readonly class LinkedAccountUses implements AccountUses
{
    public function __construct(
        private AccountSessions $sessions,
        private IdentityLinks $links,
        private CurrentAuthorizer $authorizer,
    ) {}

    public function counts(array $accounts): AccountUseCounts
    {
        $this->authorizeRead();
        $counts = new AccountUseCounts();

        foreach ($accounts as $account) {
            $counts = $counts->with($account, ProcessStart::unresolvedCountOf($account));
        }

        return $counts;
    }

    public function history(RecordIdentity $account, int $limit): array
    {
        $this->authorizeRead();

        $sessions = $this->sessions->all($account)
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->readExactly($limit)
            ->get();

        return array_values($sessions->map(fn (AgentSession $session) => $session->useOf($account))->all());
    }

    public function accountOf(string $sessionId, string $accountType): RecordIdentity
    {
        $this->authorizeRead();
        $accounts = $this->links->linkedOfType(AgentSession::byId($sessionId), $accountType);

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
