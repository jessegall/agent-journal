<?php

declare(strict_types=1);

namespace App\Agents\Activity\Data;

use App\Web\Creation\Buildable;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The Activity window's feed: a page of what the agents did, oldest first, and whether older entries are left to read
 * from before the first one.
 */
#[TypeScript]
final class ActivityWindowData extends Data
{
    /** @use Buildable<ActivityWindowDataFields> */
    use Buildable;

    protected const string FIELDS = ActivityWindowDataFields::class;

    /**
     * @param  list<ActivityEventData>  $events
     */
    public function __construct(
        #[DataCollectionOf(ActivityEventData::class)]
        public readonly array $events,
        public readonly bool $hasOlder,
    ) {}
}
