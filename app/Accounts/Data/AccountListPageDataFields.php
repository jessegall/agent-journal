<?php

declare(strict_types=1);

namespace App\Accounts\Data;

use App\Web\Creation\Exceptions\MissingFields;

final class AccountListPageDataFields
{
    /** @var list<AccountRowData> */
    private array $rows;

    private int $total;

    private int $page = 1;

    private int $lastPage = 1;

    private AccountRowData|null $selected = null;

    private int $usagePage = 1;

    private int $usageLastPage = 1;

    private AccountListData|null $addForm = null;

    /** @param list<AccountRowData> $rows */
    public function rows(array $rows): self
    {
        $this->rows = $rows;

        return $this;
    }

    public function total(int $total): self
    {
        $this->total = $total;

        return $this;
    }

    public function page(int $page): self
    {
        $this->page = $page;

        return $this;
    }

    public function lastPage(int $lastPage): self
    {
        $this->lastPage = $lastPage;

        return $this;
    }

    public function selected(AccountRowData $selected): self
    {
        $this->selected = $selected;

        return $this;
    }

    public function usagePage(int $page): self
    {
        $this->usagePage = $page;

        return $this;
    }

    public function usageLastPage(int $lastPage): self
    {
        $this->usageLastPage = $lastPage;

        return $this;
    }

    public function addForm(AccountListData $addForm): self
    {
        $this->addForm = $addForm;

        return $this;
    }

    public function finish(): AccountListPageData
    {
        if (! isset($this->rows, $this->total)) {
            throw MissingFields::forType(AccountListPageData::class, 'rows', 'total');
        }

        return new AccountListPageData(
            rows: $this->rows,
            total: $this->total,
            page: $this->page,
            lastPage: $this->lastPage,
            selected: $this->selected,
            usagePage: $this->usagePage,
            usageLastPage: $this->usageLastPage,
            addForm: $this->addForm,
        );
    }
}
