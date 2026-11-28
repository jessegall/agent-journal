<?php

declare(strict_types=1);

namespace Tests\Fixtures\ClientDeclarations\Shelf\Http\Pages;

use App\Actors\Contracts\CurrentActor;
use App\Reads\PageFormRequests;
use App\Web\Creation\Contracts\PageBuilder;
use Illuminate\Http\Request;
use Tests\Fixtures\ClientDeclarations\Shelf\ShelfPageData;
use Tests\Fixtures\ClientDeclarations\Shelf\ReaderCalls;
use Tests\Fixtures\ClientDeclarations\Shelf\ShelfRequest;

/**
 * Answers with its own query word, the route's shelf when there is one, and the id of the actor it reads for.
 */
final readonly class ShelfPageBuilder implements PageBuilder
{
    public function __construct(
        private PageFormRequests $requests,
        private CurrentActor $actors,
        private ReaderCalls $calls,
    ) {}

    public function build(Request $visit): ShelfPageData
    {
        $this->calls->readers[] = 'shelf';
        $request = $this->requests->from(ShelfRequest::class, $visit);

        return ShelfPageData::build()->titles([
            $request->queryWords(),
            $request->shelf(),
            (string) $this->actors->actor()->actorId(),
        ])->finish();
    }
}
