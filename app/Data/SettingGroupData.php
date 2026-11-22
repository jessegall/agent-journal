<?php

declare(strict_types=1);

namespace App\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One group of settings in declaration order, with its availability.
 */
#[TypeScript]
final class SettingGroupData extends Data
{
    /**
     * @param  list<SettingData>  $settings
     */
    public function __construct(
        public readonly SettingIdentityData $identity,
        public readonly string $label,
        public readonly PlainGroupAvailabilityData|ToggleGroupAvailabilityData $availability,
        #[DataCollectionOf(SettingData::class)]
        public readonly array $settings,
    ) {}
}
