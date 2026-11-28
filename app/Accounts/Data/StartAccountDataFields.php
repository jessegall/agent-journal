<?php

declare(strict_types=1);

namespace App\Accounts\Data;

use App\Accounts\Enums\AccountProcessRole;
use App\Accounts\Enums\AccountStatus;
use App\Models\Accounts\Account;
use App\Values\AccountUse;
use App\Web\Creation\Exceptions\MissingFields;

final class StartAccountDataFields
{
    private string $sessionId;

    private string $driver;

    private string $accountId;

    private string $accountLabel;

    private AccountStatus $accountState;

    private AccountProcessRole $role;

    private string $startedAt;

    private bool $hasEndedAt = false;

    private string|null $endedAt;

    public function sessionId(string $sessionId): self
    {
        $this->sessionId = $sessionId;

        return $this;
    }

    public function driver(string $driver): self
    {
        $this->driver = $driver;

        return $this;
    }

    public function accountId(string $accountId): self
    {
        $this->accountId = $accountId;

        return $this;
    }

    public function accountLabel(string $accountLabel): self
    {
        $this->accountLabel = $accountLabel;

        return $this;
    }

    public function accountState(AccountStatus $accountState): self
    {
        $this->accountState = $accountState;

        return $this;
    }

    public function role(AccountProcessRole $role): self
    {
        $this->role = $role;

        return $this;
    }

    public function startedAt(string $startedAt): self
    {
        $this->startedAt = $startedAt;

        return $this;
    }

    public function endedAt(string|null $endedAt): self
    {
        $this->endedAt = $endedAt;
        $this->hasEndedAt = true;

        return $this;
    }

    public function useOf(AccountUse $use, Account $account): self
    {
        return $this->sessionId($use->sessionId)
            ->driver($use->driver)
            ->accountId($account->id)
            ->accountLabel($account->label)
            ->accountState($account->status)
            ->role($use->role)
            ->startedAt($use->startedAt->toIso8601String())
            ->endedAt($use->endedAt?->toIso8601String());
    }

    public function finish(): StartAccountData
    {
        if (! isset($this->sessionId)) {
            throw MissingFields::forType(StartAccountData::class, 'sessionId');
        }

        if (! isset($this->driver)) {
            throw MissingFields::forType(StartAccountData::class, 'driver');
        }

        if (! isset($this->accountId)) {
            throw MissingFields::forType(StartAccountData::class, 'accountId');
        }

        if (! isset($this->accountLabel)) {
            throw MissingFields::forType(StartAccountData::class, 'accountLabel');
        }

        if (! isset($this->accountState)) {
            throw MissingFields::forType(StartAccountData::class, 'accountState');
        }

        if (! isset($this->role)) {
            throw MissingFields::forType(StartAccountData::class, 'role');
        }

        if (! isset($this->startedAt)) {
            throw MissingFields::forType(StartAccountData::class, 'startedAt');
        }

        if (! $this->hasEndedAt) {
            throw MissingFields::forType(StartAccountData::class, 'endedAt');
        }

        return new StartAccountData(
            sessionId: $this->sessionId,
            driver: $this->driver,
            accountId: $this->accountId,
            accountLabel: $this->accountLabel,
            accountState: $this->accountState,
            role: $this->role,
            startedAt: $this->startedAt,
            endedAt: $this->endedAt,
        );
    }
}
