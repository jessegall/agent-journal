<?php

declare(strict_types=1);

namespace Tests\Fixtures\ClientDeclarations\Library;

use App\Navigation\Contracts\PageResolver;
use Tests\Fixtures\ClientDeclarations\RecentNotesData;

final readonly class TwoRequestsResolver implements PageResolver
{
    public function __construct(private BooksRequest $first, private BooksRequest $second) {}

    public function read(): RecentNotesData
    {
        return new RecentNotesData([$this->first->path(), $this->second->path()]);
    }
}
