<?php

declare(strict_types=1);

namespace Domain\Sequences\Http\Pages;

use App\Reads\PageFormRequests;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\LayoutNativeData;
use App\Support\Layout\LayoutPartData;
use App\Web\Creation\Contracts\PageBuilder;
use Domain\Sequences\Data\SequenceEditorPartData;
use Domain\Sequences\Data\SequenceStepData;
use Domain\Sequences\Http\Pages\Sequences\SequencesIndex;
use Domain\Sequences\Http\Requests\NewSequenceRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

/**
 * The sequence editor beside the list for a new sequence: no name and no steps yet, stored on its first save.
 */
final readonly class NewSequencePageBuilder implements PageBuilder
{
    public function __construct(private SequencesIndex $index, private PageFormRequests $requests) {}

    public function build(Request $visit): NewSequencePageData
    {
        return NewSequencePageData::build()->shown($this->content($visit))->finish();
    }

    private function content(Request $visit): DeclaredLayoutData
    {
        $input = $this->requests->forVisit(NewSequenceRequest::class, $visit);

        $editor = SequenceEditorPartData::from([
            'name' => $input->name(),
            'steps' => array_map(fn (string $title) => SequenceStepData::from([
                'id' => strtolower((string) Str::ulid()),
                'title' => $title,
                'runsWhen' => 'The step before it is done',
                'doneWhen' => $input->doneWhen(),
            ]), $input->stepTitles()),
            'saveAddress' => route('sequences.define-sequence', [], false),
            'method' => 'POST',
            'cancelAddress' => route('sequences.index', [], false),
            'draftedBy' => $input->draftedBy(),
        ]);

        return $this->index->of(
            '',
            [LayoutPartData::build()
                ->asNative()
                ->key('editor')
                ->native(
                    LayoutNativeData::build()->component('sequences/SequenceEditor')->props($editor)->finish(),
                )
                ->finish()],
        );
    }
}
