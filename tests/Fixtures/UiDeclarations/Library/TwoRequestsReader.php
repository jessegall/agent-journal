<?php

declare(strict_types=1);

namespace Tests\Fixtures\UiDeclarations\Library;

use App\Domain\Contracts\PageReader;
use Tests\Fixtures\UiDeclarations\RecentNotesData;

final readonly class TwoRequestsReader implements PageReader
{
    public function __construct(private BooksRequest $first, private BooksRequest $second) {}

    public function read(): RecentNotesData
    {
        return new RecentNotesData([$this->first->path(), $this->second->path()]);
    }
}
