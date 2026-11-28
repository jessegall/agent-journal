<?php

declare(strict_types=1);

namespace Domain\Sequences\Http\Pages;

use App\Actors\Exceptions\CrossOwnerReadRefused;
use App\Exceptions\InvalidActorText;
use App\Reads\PageFormRequests;
use App\Support\Layout\DeclaredLayoutData;
use App\Web\Creation\Contracts\PageBuilder;
use Domain\Sequences\Http\Pages\SequenceRuns\SequenceRunsIndex;
use Domain\Sequences\Http\Requests\SequenceRunsRequest;
use Domain\Sequences\Resolvers\Support\SequenceRecords;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * The runs list: the chosen actor's runs, or the first actor's when none was chosen; a caller who may not read every
 * owner's runs finds no such page.
 */
final readonly class SequenceRunsPageBuilder implements PageBuilder
{
    public function __construct(
        private PageFormRequests $requests,
        private SequenceRecords $runs,
        private SequenceRunsIndex $page,
    ) {}

    public function build(Request $visit): SequenceRunsPageData
    {
        return SequenceRunsPageData::build()->shown($this->content($visit))->finish();
    }

    private function content(Request $visit): DeclaredLayoutData
    {
        $input = $this->requests->from(SequenceRunsRequest::class, $visit);

        try {
            $followers = $this->runs->followers();

            if ($followers === [] && ! $input->hasFollower()) {
                return $this->page->none();
            }

            $follower = $input->hasFollower() ? $input->follower() : $followers[0];

            return $this->page->of($followers, $follower, $this->runs->runsOf($follower, $input->pageNumber()));
        } catch (CrossOwnerReadRefused|InvalidActorText $refused) {
            throw new NotFoundHttpException(previous: $refused);
        }
    }
}
