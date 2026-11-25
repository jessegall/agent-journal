<?php

declare(strict_types=1);

namespace Domain\Sequences\Http\Pages\Resolvers;

use App\Contracts\Navigation\PageResolver;
use App\Support\Layout\DeclaredLayoutData;
use Domain\Sequences\Exceptions\SequenceMissing;
use Domain\Sequences\Http\Pages\Sequences\SequencesShow;
use Domain\Sequences\Http\Requests\SequenceRequest;
use Domain\Sequences\Models\Sequence;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * The Sequences page with one sequence chosen: the sequence and its steps. A sequence that is not there is not
 * found.
 */
final readonly class SequenceWindowResolver implements PageResolver
{
    public function __construct(
        private SequenceRequest $request,
        private SequencesShow $page,
    ) {}

    public function read(): DeclaredLayoutData
    {
        try {
            $sequence = Sequence::findById($this->request->sequenceId());
        } catch (SequenceMissing $missing) {
            throw new NotFoundHttpException(previous: $missing);
        }

        return $this->page->of($sequence);
    }
}
