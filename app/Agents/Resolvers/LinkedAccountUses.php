<?php

declare(strict_types=1);

namespace App\Agents\Resolvers;

use App\Actors\Contracts\CurrentAuthorizer;
use App\Agents\Contracts\AccountUses;
use App\Agents\Exceptions\AccountUseMissing;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Agents\Models\ProcessStart;
use App\Agents\Policies\AgentMaintenancePolicy;
use App\Agents\Support\AccountSessions;
use App\Agents\Support\AccountUseCounts;
use App\Operations\Enums\AccessType;
use App\Records\Contracts\IdentityLinks;
use App\Records\Support\RecordIdentity;

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
