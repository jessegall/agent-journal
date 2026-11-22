<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Resolvers;

use App\Contracts\Navigation\PageResolver;
use Tests\Fixtures\Modules\Notes\Data\CollectionPageData;
use Tests\Fixtures\Modules\Notes\Http\Requests\CollectionRequest;
use Tests\Fixtures\Modules\Notes\Models\Note;

/**
 * One collection: the notes the calling actor wrote in that month.
 */
final readonly class CollectionWindowResolver implements PageResolver
{
    public function __construct(private CollectionRequest $request) {}

    public function read(): CollectionPageData
    {
        $collection = $this->request->collection();

        return CollectionPageData::from([
            'collection' => $collection,
            'texts' => array_values(
Note::query()->forActor()->where('created_at', 'like', "{$collection}-%")->pluck('text')->all(),
),
        ]);
    }
}
