<?php

declare(strict_types=1);

namespace App\Support\Layout;

final class ListPagingFields
{
    private int $page = 1;

    private int $lastPage = 1;

    private string|null $after = null;

    private bool $isAppend = false;

    private bool $isCursor = false;

    private string $parameter = 'page';

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

    public function after(string|null $after): self
    {
        $this->after = $after;
        $this->isCursor = true;

        return $this;
    }

    public function isAppend(bool $isAppend): self
    {
        $this->isAppend = $isAppend;
        $this->isCursor = true;

        return $this;
    }

    public function parameter(string $parameter): self
    {
        $this->parameter = $parameter;

        return $this;
    }

    public function finish(): ListPaging
    {
        return new ListPaging(
            page: $this->page,
            lastPage: $this->lastPage,
            after: $this->after,
            isAppend: $this->isAppend,
            isCursor: $this->isCursor,
            parameter: $this->parameter,
        );
    }
}
