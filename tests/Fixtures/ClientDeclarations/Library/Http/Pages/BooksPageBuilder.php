<?php

declare(strict_types=1);

namespace Tests\Fixtures\ClientDeclarations\Library\Http\Pages;

use App\Reads\PageFormRequests;
use App\Web\Creation\Contracts\PageBuilder;
use Illuminate\Http\Request;
use Tests\Fixtures\ClientDeclarations\Library\BooksPageData;
use Tests\Fixtures\ClientDeclarations\Library\BooksRequest;

final readonly class BooksPageBuilder implements PageBuilder
{
    public function __construct(private PageFormRequests $requests) {}

    public function build(Request $visit): BooksPageData
    {
        $request = $this->requests->from(BooksRequest::class, $visit);

        return BooksPageData::build()->titles([$request->path()])->finish();
    }
}
