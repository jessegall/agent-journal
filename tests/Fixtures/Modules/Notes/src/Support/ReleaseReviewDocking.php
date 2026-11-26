<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Support;

use App\Exceptions\DockSourceUnavailable;
use App\Support\Cards\ComposedCard;
use App\Support\Sources\Contracts\CardContext;
use App\Support\Sources\Contracts\Dockable;
use App\Support\Sources\Contracts\DockableProvider;
use App\Support\Sources\DockDefinition;
use App\Values\ProjectOwner;
use DateTimeImmutable;
use Tests\Fixtures\Modules\Notes\Models\Note;

/**
 * Makes the release review again from its key: its passed checks are the notes, at most eight.
 */
final readonly class ReleaseReviewDocking implements DockableProvider
{
    public function requireReadable(DockDefinition $definition, string $id): Dockable
    {
        if (! in_array($id, [ReleaseReview::KEY, ReleaseReview::OVERSIZED_KEY], true)) {
            throw DockSourceUnavailable::of($definition->type, $id);
        }

        return $this->review($id);
    }

    public function ownerOf(DockDefinition $definition, string $id): ProjectOwner
    {
        return ProjectOwner::global();
    }

    public function cardsFor(DockDefinition $definition, array $ids, CardContext $context): array
    {
        $cards = [];

        foreach (array_intersect($ids, [ReleaseReview::KEY, ReleaseReview::OVERSIZED_KEY]) as $id) {
            $review = $this->review($id);
            $cards[] = new ComposedCard($review->identifyFor($definition), $review->composeDockCard($context));
        }

        return $cards;
    }

    private function review(string $key): ReleaseReview
    {
        return new ReleaseReview($key, min(Note::query()->count(), ReleaseReview::TOTAL_CHECKS), new DateTimeImmutable());
    }
}
