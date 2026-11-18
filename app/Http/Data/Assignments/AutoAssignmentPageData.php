<?php

declare(strict_types=1);

namespace App\Http\Data\Assignments;

use App\Assignments\Support\AutoAssignmentPage;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

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
        public readonly string|Optional $nextAfterId = new Optional(),
    ) {}

    public static function of(AutoAssignmentPage $page): self
    {
        return self::from([
            'facts' => array_map(AutoAssignmentFactData::of(...), $page->facts),
            'nextAfterId' => $page->nextAfterId ?? Optional::create(),
        ]);
    }
}
