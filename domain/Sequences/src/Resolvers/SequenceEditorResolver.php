<?php

declare(strict_types=1);

namespace Domain\Sequences\Resolvers;

use App\Contracts\Navigation\PageResolver;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\LayoutNativeData;
use App\Support\Layout\LayoutPartData;
use Domain\Sequences\Data\SequenceEditorPartData;
use Domain\Sequences\Exceptions\SequenceMissing;
use Domain\Sequences\Http\Requests\SequenceRequest;
use Domain\Sequences\Models\Sequence;
use Domain\Sequences\Resolvers\Support\SequenceIndexLayout;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * The sequence editor beside the list: Edit steps of a stored sequence, saved as its next version.
 */
final readonly class SequenceEditorResolver implements PageResolver
{
    public function __construct(
        private SequenceRequest $request,
        private SequenceIndexLayout $index,
    ) {}

    public function read(): DeclaredLayoutData
    {
        try {
            $sequence = Sequence::byId($this->request->sequenceId());
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
            [LayoutPartData::native('editor', LayoutNativeData::of('sequences/SequenceEditor', $editor))],
        );
    }
}
