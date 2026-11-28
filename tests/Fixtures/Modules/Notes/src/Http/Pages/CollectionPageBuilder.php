<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Http\Pages;

use App\Reads\PageFormRequests;
use App\Web\Creation\Contracts\PageBuilder;
use Illuminate\Http\Request;
use Tests\Fixtures\Modules\Notes\Data\CollectionPageData;
use Tests\Fixtures\Modules\Notes\Http\Requests\CollectionRequest;
use Tests\Fixtures\Modules\Notes\Models\Note;

/**
 * One collection: the notes the calling actor wrote in that month.
 */
final readonly class CollectionPageBuilder implements PageBuilder
{
    public function __construct(private PageFormRequests $requests) {}

    public function build(Request $visit): CollectionPageData
    {
        $collection = $this->requests->forVisit(CollectionRequest::class, $visit)->collection();
        $notes = Note::query()->forActor()->where('created_at', 'like', "{$collection}-%")->get(['text']);
        $texts = array_values($notes->map(fn (Note $note) => $note->text)->all());

        return CollectionPageData::build()->collection($collection)->texts($texts)->finish();
    }
}
