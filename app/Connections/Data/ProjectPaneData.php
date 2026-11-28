<?php

declare(strict_types=1);

namespace App\Connections\Data;

use App\Projects\Enums\ProjectWindowStatus;
use App\Web\Attributes\Bounded;
use App\Web\Attributes\Live;
use App\Web\Attributes\Optional as OptionalProp;
use App\Web\Attributes\WindowOnly;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
#[WindowOnly, OptionalProp, Live]
final class ProjectPaneData extends Data
{
    /** @use \App\Web\Creation\Buildable<ProjectPaneDataFields> */
    use \App\Web\Creation\Buildable;

    protected const string FIELDS = ProjectPaneDataFields::class;

    /** @param list<ProjectTreeEntryData> $items */
    public function __construct(
        #[DataCollectionOf(ProjectTreeEntryData::class), Bounded(25)]
        public readonly array $items,
        public readonly string $fullUrl,
        public readonly ProjectWindowStatus $status,
        public readonly string $connectUrl,
    ) {}
}
