<?php

declare(strict_types=1);

namespace App\Accounts\Data;

use App\Accounts\Enums\AccountStatus;
use App\Accounts\Enums\CleanupProblem;
use App\Accounts\SignInProtocols;
use App\Models\Accounts\Account;
use App\Web\Creation\Exceptions\MissingFields;
use Spatie\LaravelData\Optional;

final class AccountRowDataFields
{
    private string $id;

    private string $driver;

    private string $label;

    private int $nameRevision;

    private SignInMethodData $signIn;

    private AccountStatus $status;

    private bool $hasIdentity = false;

    private string|null $identity;

    private bool $hasWorkspace = false;

    private string|null $workspace;

    private bool $isActive;

    private int $runningCount;

    private bool $hasCheckedAt = false;

    private string|null $checkedAt;

    private bool $hasExpiresAt = false;

    private string|null $expiresAt;

    private bool $hasCleanupProblem = false;

    private CleanupProblem|null $cleanupProblem;

    private bool $awaitsCleanupRetry;

    private bool $isHeldForCheck;

    private bool $isCheckInconclusive;

    /** @var list<AccountStartData> */
    private array $recentStarts;

    private AccountUsageData|Optional $usage;

    public function id(string $id): self
    {
        $this->id = $id;

        return $this;
    }

    public function driver(string $driver): self
    {
        $this->driver = $driver;

        return $this;
    }

    public function label(string $label): self
    {
        $this->label = $label;

        return $this;
    }

    public function nameRevision(int $nameRevision): self
    {
        $this->nameRevision = $nameRevision;

        return $this;
    }

    public function signIn(SignInMethodData $signIn): self
    {
        $this->signIn = $signIn;

        return $this;
    }

    public function status(AccountStatus $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function identity(string|null $identity): self
    {
        $this->identity = $identity;
        $this->hasIdentity = true;

        return $this;
    }

    public function workspace(string|null $workspace): self
    {
        $this->workspace = $workspace;
        $this->hasWorkspace = true;

        return $this;
    }

    public function isActive(bool $isActive): self
    {
        $this->isActive = $isActive;

        return $this;
    }

    public function runningCount(int $runningCount): self
    {
        $this->runningCount = $runningCount;

        return $this;
    }

    public function checkedAt(string|null $checkedAt): self
    {
        $this->checkedAt = $checkedAt;
        $this->hasCheckedAt = true;

        return $this;
    }

    public function expiresAt(string|null $expiresAt): self
    {
        $this->expiresAt = $expiresAt;
        $this->hasExpiresAt = true;

        return $this;
    }

    public function cleanupProblem(CleanupProblem|null $cleanupProblem): self
    {
        $this->cleanupProblem = $cleanupProblem;
        $this->hasCleanupProblem = true;

        return $this;
    }

    public function awaitsCleanupRetry(bool $awaitsCleanupRetry): self
    {
        $this->awaitsCleanupRetry = $awaitsCleanupRetry;

        return $this;
    }

    public function isHeldForCheck(bool $isHeldForCheck): self
    {
        $this->isHeldForCheck = $isHeldForCheck;

        return $this;
    }

    public function isCheckInconclusive(bool $isCheckInconclusive): self
    {
        $this->isCheckInconclusive = $isCheckInconclusive;

        return $this;
    }

    /** @param list<AccountStartData> $recentStarts */
    public function recentStarts(array $recentStarts): self
    {
        $this->recentStarts = $recentStarts;

        return $this;
    }

    public function usage(AccountUsageData|Optional $usage): self
    {
        $this->usage = $usage;

        return $this;
    }

    public function account(Account $account, SignInProtocols $protocols): self
    {
        return $this->id($account->id)
            ->driver($account->account_protocol)
            ->label($account->label)
            ->nameRevision($account->name_revision)
            ->signIn(SignInMethodData::fromProtocol(
                $account->method,
                $protocols->for($account->account_protocol, $account->method),
            ))
            ->status($account->status)
            ->identity($account->identity)
            ->workspace($account->workspace)
            ->checkedAt($account->checked_at?->toIso8601String())
            ->expiresAt($account->expires_at?->toIso8601String())
            ->cleanupProblem($account->cleanup_problem)
            ->awaitsCleanupRetry($account->awaitsCleanupRetry())
            ->isHeldForCheck($account->isHeldForCheck())
            ->isCheckInconclusive($account->isCheckInconclusive());
    }

    public function finish(): AccountRowData
    {
        if (! isset($this->id)) {
            throw MissingFields::forType(AccountRowData::class, 'id');
        }

        if (! isset($this->driver)) {
            throw MissingFields::forType(AccountRowData::class, 'driver');
        }

        if (! isset($this->label)) {
            throw MissingFields::forType(AccountRowData::class, 'label');
        }

        if (! isset($this->nameRevision)) {
            throw MissingFields::forType(AccountRowData::class, 'nameRevision');
        }

        if (! isset($this->signIn)) {
            throw MissingFields::forType(AccountRowData::class, 'signIn');
        }

        if (! isset($this->status)) {
            throw MissingFields::forType(AccountRowData::class, 'status');
        }

        if (! $this->hasIdentity) {
            throw MissingFields::forType(AccountRowData::class, 'identity');
        }

        if (! $this->hasWorkspace) {
            throw MissingFields::forType(AccountRowData::class, 'workspace');
        }

        if (! isset($this->isActive)) {
            throw MissingFields::forType(AccountRowData::class, 'isActive');
        }

        if (! isset($this->runningCount)) {
            throw MissingFields::forType(AccountRowData::class, 'runningCount');
        }

        if (! $this->hasCheckedAt) {
            throw MissingFields::forType(AccountRowData::class, 'checkedAt');
        }

        if (! $this->hasExpiresAt) {
            throw MissingFields::forType(AccountRowData::class, 'expiresAt');
        }

        if (! $this->hasCleanupProblem) {
            throw MissingFields::forType(AccountRowData::class, 'cleanupProblem');
        }

        if (! isset($this->awaitsCleanupRetry)) {
            throw MissingFields::forType(AccountRowData::class, 'awaitsCleanupRetry');
        }

        if (! isset($this->isHeldForCheck)) {
            throw MissingFields::forType(AccountRowData::class, 'isHeldForCheck');
        }

        if (! isset($this->isCheckInconclusive)) {
            throw MissingFields::forType(AccountRowData::class, 'isCheckInconclusive');
        }

        if (! isset($this->recentStarts)) {
            throw MissingFields::forType(AccountRowData::class, 'recentStarts');
        }

        if (! isset($this->usage)) {
            throw MissingFields::forType(AccountRowData::class, 'usage');
        }

        return new AccountRowData(
            id: $this->id,
            driver: $this->driver,
            label: $this->label,
            nameRevision: $this->nameRevision,
            signIn: $this->signIn,
            status: $this->status,
            identity: $this->identity,
            workspace: $this->workspace,
            isActive: $this->isActive,
            runningCount: $this->runningCount,
            checkedAt: $this->checkedAt,
            expiresAt: $this->expiresAt,
            cleanupProblem: $this->cleanupProblem,
            awaitsCleanupRetry: $this->awaitsCleanupRetry,
            isHeldForCheck: $this->isHeldForCheck,
            isCheckInconclusive: $this->isCheckInconclusive,
            recentStarts: $this->recentStarts,
            usage: $this->usage,
        );
    }
}
