<?php

declare(strict_types=1);

namespace Domain\Sequences\Resolvers;

use App\Contracts\Navigation\PageResolver;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\LayoutNativeData;
use App\Support\Layout\LayoutPartData;
use Domain\Sequences\Data\SequenceEditorPartData;
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
        $editor = [
            'name' => $this->request->name(),
            'steps' => array_map(fn (string $title) => [
                'id' => strtolower((string) Str::ulid()),
                'title' => $title,
                'runsWhen' => 'The step before it is done',
                'doneWhen' => $this->request->doneWhen(),
            ], $this->request->stepTitles()),
            'saveAddress' => route('sequences.define-sequence', [], false),
            'method' => 'POST',
            'cancelAddress' => route('sequences.index', [], false),
        ];

        if ($this->request->draftedBy() !== '') {
            $editor['draftedBy'] = $this->request->draftedBy();
        }

        $editor = SequenceEditorPartData::from($editor);

        return $this->index->of(
            '',
            [LayoutPartData::native('editor', LayoutNativeData::of('sequences/SequenceEditor', $editor))],
        );
    }
}
