<?php

declare(strict_types=1);

namespace Tests\Fixtures\UiDeclarations\Shelf;

use App\Core\Contracts\CurrentActor;
use App\Domain\Contracts\PageReader;
use Tests\Fixtures\UiDeclarations\RecentNotesData;

/**
 * Answers with its own query word, the route's shelf when there is one, and the id of the actor it reads for.
 */
final readonly class ShelfReader implements PageReader
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
            $this->request->string('q')->toString(),
            (string) $this->request->route('shelf'),
            (string) $this->actors->actor()->actorId(),
        ]);
    }
}
