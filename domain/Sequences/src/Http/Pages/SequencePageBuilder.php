<?php

declare(strict_types=1);

namespace Domain\Sequences\Http\Pages;

use App\Reads\PageFormRequests;
use App\Support\Layout\DeclaredLayoutData;
use App\Web\Creation\Contracts\PageBuilder;
use Domain\Sequences\Exceptions\SequenceMissing;
use Domain\Sequences\Http\Pages\Sequences\SequencesShow;
use Domain\Sequences\Http\Requests\SequenceRequest;
use Domain\Sequences\Models\Sequence;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * The Sequences page with one sequence chosen: the sequence and its steps. A sequence that is not there is not
 * found.
 */
final readonly class SequencePageBuilder implements PageBuilder
{
    public function __construct(
        private PageFormRequests $requests,
        private SequencesShow $page,
    ) {}

    public function build(Request $visit): SequencePageData
    {
        return SequencePageData::build()->shown($this->content($visit))->finish();
    }

    private function content(Request $visit): DeclaredLayoutData
    {
        $input = $this->requests->forVisit(SequenceRequest::class, $visit);

        try {
            $sequence = Sequence::findById($input->sequenceId());
        } catch (SequenceMissing $missing) {
            throw new NotFoundHttpException(previous: $missing);
        }

        return $this->page->of($sequence);
    }
}
