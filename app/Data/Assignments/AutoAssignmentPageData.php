<?php

declare(strict_types=1);

namespace App\Data\Assignments;

use App\Support\AutoAssignmentPage;
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

    public static function of(AutoAssignmentPage $page): self
    {
        return self::from(['facts' => $page->facts, 'nextAfterId' => $page->nextAfterId]);
    }
}
