<?php

declare(strict_types=1);

namespace App\Assignments\Data;

use App\Support\AutoAssignmentFact;
use App\Support\CursorPage;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * One page of an actor's auto-assignments, and the id the next page starts after when there is one.
 */
final class AutoAssignmentPageData extends Data
{
    /**
     * @param  list<AutoAssignmentFactData>  $facts
     */
    public function __construct(
        #[DataCollectionOf(AutoAssignmentFactData::class)]
        public readonly array $facts,
        public readonly string|null $nextAfterId = null,
    ) {}

    /** @param CursorPage<AutoAssignmentFact> $page */
    public static function of(CursorPage $page): self
    {
        return self::from(['facts' => $page->items, 'nextAfterId' => $page->nextAfterId]);
    }
}
