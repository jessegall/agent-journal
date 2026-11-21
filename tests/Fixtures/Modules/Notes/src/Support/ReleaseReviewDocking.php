<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Support;

use App\Docking\Cards\ComposedCard;
use App\Docking\Exceptions\DockSourceUnavailable;
use App\Docking\Sources\Contracts\CardContext;
use App\Docking\Sources\Contracts\Dockable;
use App\Docking\Sources\Contracts\DockableProvider;
use App\Docking\Sources\DockDefinition;
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
