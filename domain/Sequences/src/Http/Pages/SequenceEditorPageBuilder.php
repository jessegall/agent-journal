<?php

declare(strict_types=1);

namespace Domain\Sequences\Http\Pages;

use App\Reads\PageFormRequests;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\LayoutNativeData;
use App\Support\Layout\LayoutPartData;
use App\Web\Creation\Contracts\PageBuilder;
use Domain\Sequences\Data\SequenceEditorPartData;
use Domain\Sequences\Exceptions\SequenceMissing;
use Domain\Sequences\Http\Pages\Sequences\SequencesIndex;
use Domain\Sequences\Http\Requests\SequenceRequest;
use Domain\Sequences\Models\Sequence;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * The sequence editor beside the list: Edit steps of a stored sequence, saved as its next version.
 */
final readonly class SequenceEditorPageBuilder implements PageBuilder
{
    public function __construct(
        private PageFormRequests $requests,
        private SequencesIndex $index,
    ) {}

    public function build(Request $visit): SequenceEditorPageData
    {
        return SequenceEditorPageData::build()->shown($this->content($visit))->finish();
    }

    private function content(Request $visit): DeclaredLayoutData
    {
        $input = $this->requests->from(SequenceRequest::class, $visit);

        try {
            $sequence = Sequence::findById($input->sequenceId());
        } catch (SequenceMissing $missing) {
            throw new NotFoundHttpException(previous: $missing);
        }

        $editor = SequenceEditorPartData::from([
            'name' => $sequence->name,
            'steps' => $sequence->stepList(),
            'saveAddress' => route('sequences.change-sequence', ['sequence' => $sequence->id], false),
            'method' => 'PATCH',
            'cancelAddress' => route('sequences.sequence', ['sequence' => $sequence->id], false),
            'version' => (string) $sequence->version,
        ]);

        return $this->index->of(
            $sequence->id,
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
