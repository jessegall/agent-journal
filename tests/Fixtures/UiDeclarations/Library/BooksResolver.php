<?php

declare(strict_types=1);

namespace Tests\Fixtures\UiDeclarations\Library;

use App\Contracts\Navigation\PageResolver;
use Tests\Fixtures\UiDeclarations\RecentNotesData;

final readonly class BooksResolver implements PageResolver
{
    public function __construct(private BooksRequest $request) {}

    public function read(): RecentNotesData
    {
        return new RecentNotesData([$this->request->path()]);
    }
}
