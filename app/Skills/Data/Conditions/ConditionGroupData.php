<?php

declare(strict_types=1);

namespace App\Skills\Data\Conditions;

use Spatie\LaravelData\Attributes\DataCollectionOf;

/**
 * A stored condition that holds when all, or any, of its children hold.
 */
final class ConditionGroupData extends StoredConditionData
{
    /**
     * @param  list<StoredConditionData>  $children
     */
    public function __construct(
        string $type,
        public readonly int $version,
        #[DataCollectionOf(StoredConditionData::class)]
        public readonly array $children,
    ) {
        $this->type = $type;
    }
}
