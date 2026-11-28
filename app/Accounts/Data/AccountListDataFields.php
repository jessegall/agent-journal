<?php

declare(strict_types=1);

namespace App\Accounts\Data;

use App\Web\Creation\Exceptions\MissingFields;

final class AccountListDataFields
{
    /** @var list<AccountRowData> */
    private array $rows;

    /** @var list<AccountSelectionData> */
    private array $selections;

    /** @var list<SignInAttemptData> */
    private array $attempts;

    /** @var list<PendingAttemptCleanupData> */
    private array $pendingCleanups;

    /** @var list<DriverMethodsData> */
    private array $methods;

    /** @param list<AccountRowData> $rows */
    public function rows(array $rows): self
    {
        $this->rows = $rows;

        return $this;
    }

    /** @param list<AccountSelectionData> $selections */
    public function selections(array $selections): self
    {
        $this->selections = $selections;

        return $this;
    }

    /** @param list<SignInAttemptData> $attempts */
    public function attempts(array $attempts): self
    {
        $this->attempts = $attempts;

        return $this;
    }

    /** @param list<PendingAttemptCleanupData> $pendingCleanups */
    public function pendingCleanups(array $cleanups): self
    {
        $this->pendingCleanups = $cleanups;

        return $this;
    }

    /** @param list<DriverMethodsData> $methods */
    public function methods(array $methods): self
    {
        $this->methods = $methods;

        return $this;
    }

    public function finish(): AccountListData
    {
        if (! isset($this->rows)) {
            throw MissingFields::forType(AccountListData::class, 'rows');
        }

        if (! isset($this->selections)) {
            throw MissingFields::forType(AccountListData::class, 'selections');
        }

        if (! isset($this->attempts)) {
            throw MissingFields::forType(AccountListData::class, 'attempts');
        }

        if (! isset($this->pendingCleanups)) {
            throw MissingFields::forType(AccountListData::class, 'pendingCleanups');
        }

        if (! isset($this->methods)) {
            throw MissingFields::forType(AccountListData::class, 'methods');
        }

        return new AccountListData(
            rows: $this->rows,
            selections: $this->selections,
            attempts: $this->attempts,
            pendingCleanups: $this->pendingCleanups,
            methods: $this->methods,
        );
    }
}
