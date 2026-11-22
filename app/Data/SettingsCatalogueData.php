<?php

declare(strict_types=1);

namespace App\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Everything one owner's settings hold, for the journal's owner to inspect and change: the revision a change must
 * be made against and every group in declaration order.
 */
#[TypeScript]
final class SettingsCatalogueData extends Data
{
    /**
     * @param  list<SettingGroupData>  $groups
     */
    public function __construct(
        public readonly string $owner,
        public readonly string $title,
        public readonly int $revision,
        #[DataCollectionOf(SettingGroupData::class)]
        public readonly array $groups,
    ) {}

    /**
     * Whether the owner declares any setting, so its section has rows to show.
     */
    public function declaresSettings(): bool
    {
        return array_any($this->groups, fn (SettingGroupData $group) => $group->settings !== []);
    }
}
