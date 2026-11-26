<?php

declare(strict_types=1);

namespace Domain\Sequences\Http\Pages\Resolvers;

use App\Actors\Exceptions\CrossOwnerReadRefused;
use App\Exceptions\InvalidActorText;
use App\Navigation\Contracts\PageResolver;
use App\Support\Layout\DeclaredLayoutData;
use Domain\Sequences\Http\Pages\SequenceRuns\SequenceRunsIndex;
use Domain\Sequences\Http\Requests\SequenceRunsRequest;
use Domain\Sequences\Resolvers\Support\SequenceRecords;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * The runs list: the chosen actor's runs, or the first actor's when none was chosen; a caller who may not read every
 * owner's runs finds no such page.
 */
final readonly class SequenceRunsResolver implements PageResolver
{
    public function __construct(
        private SequenceRunsRequest $request,
        private SequenceRecords $runs,
        private SequenceRunsIndex $page,
    ) {}

    public function read(): DeclaredLayoutData
    {
        try {
            $followers = $this->runs->followers();

            if ($followers === [] && ! $this->request->hasFollower()) {
                return $this->page->none();
            }

            $follower = $this->request->hasFollower() ? $this->request->follower() : $followers[0];

            return $this->page->of($followers, $follower, $this->runs->runsOf($follower, $this->request->pageNumber()));
        } catch (CrossOwnerReadRefused|InvalidActorText $refused) {
            throw new NotFoundHttpException(previous: $refused);
        }
    }
}
