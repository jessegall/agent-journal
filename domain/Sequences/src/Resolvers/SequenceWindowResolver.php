<?php

declare(strict_types=1);

namespace Domain\Sequences\Resolvers;

use App\Contracts\Navigation\PageResolver;
use App\Support\Layout\DeclaredLayoutData;
use Domain\Sequences\Exceptions\SequenceMissing;
use Domain\Sequences\Http\Pages\Sequences\SequencesShow;
use Domain\Sequences\Http\Requests\SequenceRequest;
use Domain\Sequences\Models\Sequence;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * The Sequences page with one sequence chosen: the sequence and its newest runs. A sequence that is not there is not
 * found.
 */
final readonly class SequenceWindowResolver implements PageResolver
{
    private const int RUN_LIMIT = 20;

    public function __construct(
        private SequenceRequest $request,
        private SequencesShow $page,
    ) {}

    public function read(): DeclaredLayoutData
    {
        try {
            $sequence = Sequence::byId($this->request->sequenceId());
        } catch (SequenceMissing $missing) {
            throw new NotFoundHttpException(previous: $missing);
        }

        $runs = array_values($sequence->runs()->acrossActors()->limit(self::RUN_LIMIT)->get()->all());

        return $this->page->of($sequence, $runs);
    }
}
