<?php

declare(strict_types=1);

namespace App\Skills\Data\Conditions;

use App\Skills\Conditions\Not;
use Spatie\LaravelData\Attributes\DataCollectionOf;

/**
 * A stored condition that holds when its one child does not.
 */
final class NegatedConditionData extends StoredConditionData
{
    /**
     * @param  list<StoredConditionData>  $children
     */
    public function __construct(
        public readonly int $version,
        #[DataCollectionOf(StoredConditionData::class)]
        public readonly array $children,
    ) {
        $this->type = Not::TYPE;
    }
}
