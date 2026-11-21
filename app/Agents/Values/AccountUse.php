<?php

declare(strict_types=1);

namespace App\Agents\Values;

use App\Agents\Enums\AccountProcessRole;
use App\Records\Support\RecordIdentity;
use Carbon\CarbonImmutable;

/**
 * One start that used an account: the account by identity, the session and agent, and when it started and ended.
 * A use still running has no end yet.
 */
final readonly class AccountUse
{
    public function __construct(
        public RecordIdentity $account,
        public string $sessionId,
        public string $agentId,
        public string $program,
        public AccountProcessRole $role,
        public CarbonImmutable $startedAt,
        public CarbonImmutable|null $endedAt,
    ) {}

    public function isRunning(): bool
    {
        return $this->endedAt === null;
    }
}
