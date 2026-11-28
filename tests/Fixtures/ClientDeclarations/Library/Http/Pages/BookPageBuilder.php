<?php

declare(strict_types=1);

namespace Tests\Fixtures\ClientDeclarations\Library\Http\Pages;

use App\Reads\PageFormRequests;
use App\Web\Creation\Contracts\PageBuilder;
use Illuminate\Http\Request;
use Tests\Fixtures\ClientDeclarations\Library\BookPageData;
use Tests\Fixtures\ClientDeclarations\Library\BooksRequest;

final readonly class BookPageBuilder implements PageBuilder
{
    public function __construct(private PageFormRequests $requests) {}

    public function build(Request $visit): BookPageData
    {
        $request = $this->requests->forVisit(BooksRequest::class, $visit);

        return BookPageData::build()->titles([$request->path()])->finish();
    }
}
