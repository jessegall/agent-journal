<?php

declare(strict_types=1);

namespace Tests\Fixtures\UiDeclarations\Library;

use App\Domain\Contracts\PageReader;
use Tests\Fixtures\UiDeclarations\RecentNotesData;

final readonly class BooksReader implements PageReader
{
    public function __construct(private BooksRequest $request) {}

    public function read(): RecentNotesData
    {
        return new RecentNotesData([$this->request->path()]);
    }
}
