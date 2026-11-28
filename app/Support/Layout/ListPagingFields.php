<?php

declare(strict_types=1);

namespace App\Support\Layout;

final class ListPagingFields
{
    private int $page = 1;

    private int $lastPage = 1;

    private string|null $after = null;

    private bool $isAppend = false;

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

        return $this;
    }

    public function isAppend(bool $isAppend): self
    {
        $this->isAppend = $isAppend;

        return $this;
    }

    public function finish(): ListPaging
    {
        return new ListPaging(
            page: $this->page,
            lastPage: $this->lastPage,
            after: $this->after,
            isAppend: $this->isAppend,
        );
    }
}
