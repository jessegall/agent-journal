<?php

declare(strict_types=1);

namespace Tests\Fixtures\UiDeclarations\Shelf;

use App\Contracts\Actors\CurrentActor;
use App\Contracts\Navigation\PageResolver;
use Tests\Fixtures\UiDeclarations\RecentNotesData;

/**
 * Answers with its own query word, the route's shelf when there is one, and the id of the actor it reads for.
 */
final readonly class ShelfResolver implements PageResolver
{
    public function __construct(
        private ShelfRequest $request,
        private CurrentActor $actors,
        private ReaderCalls $calls,
    ) {}

    public function read(): RecentNotesData
    {
        $this->calls->readers[] = 'shelf';

        return new RecentNotesData([
            $this->request->queryWords(),
            $this->request->shelf(),
            (string) $this->actors->actor()->actorId(),
        ]);
    }
}
