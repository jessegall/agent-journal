<?php

declare(strict_types=1);

namespace Domain\Sequences\Http\Pages\Resolvers;

use App\Navigation\Contracts\PageResolver;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\LayoutNativeData;
use App\Support\Layout\LayoutPartData;
use Domain\Sequences\Data\SequenceEditorPartData;
use Domain\Sequences\Data\SequenceStepData;
use Domain\Sequences\Http\Pages\Sequences\SequencesIndex;
use Domain\Sequences\Http\Requests\NewSequenceRequest;
use Illuminate\Support\Str;

/**
 * The sequence editor beside the list for a new sequence: no name and no steps yet, stored on its first save.
 */
final readonly class NewSequenceResolver implements PageResolver
{
    public function __construct(private SequencesIndex $index, private NewSequenceRequest $request) {}

    public function read(): DeclaredLayoutData
    {
        $editor = SequenceEditorPartData::from([
            'name' => $this->request->name(),
            'steps' => array_map(fn (string $title) => SequenceStepData::from([
                'id' => strtolower((string) Str::ulid()),
                'title' => $title,
                'runsWhen' => 'The step before it is done',
                'doneWhen' => $this->request->doneWhen(),
            ]), $this->request->stepTitles()),
            'saveAddress' => route('sequences.define-sequence', [], false),
            'method' => 'POST',
            'cancelAddress' => route('sequences.index', [], false),
            'draftedBy' => $this->request->draftedBy(),
        ]);

        return $this->index->of(
            '',
            [LayoutPartData::native('editor', LayoutNativeData::of('sequences/SequenceEditor', $editor))],
        );
    }
}
