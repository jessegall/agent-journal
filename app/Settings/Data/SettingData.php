<?php

declare(strict_types=1);

namespace App\Settings\Data;

use App\Settings\Enums\SettingAvailability;
use App\Settings\Enums\SettingSource;
use App\Settings\Enums\SettingType;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One setting as its owner inspects it: what it is, what it accepts, its default, and its stored value when it has
 * one. A stored value it does not accept shows as invalid, never as the stored content. A boolean setting has no
 * constraints.
 */
#[TypeScript]
final class SettingData extends Data
{
    public function __construct(
        public readonly SettingIdentityData $identity,
        public readonly string $label,
        public readonly SettingType $type,
        public readonly SettingSource $source,
        public readonly SettingAvailability $availability,
        public readonly StringValueData
            |BooleanValueData
            |IntegerValueData
            |DecimalValueData
            |StringChoiceValueData
            |IntegerChoiceValueData $default,
        public readonly StringConstraintsData
            |IntegerConstraintsData
            |DecimalConstraintsData
            |StringChoiceConstraintsData
            |IntegerChoiceConstraintsData
            |Optional $constraints = new Optional(),
        public readonly StringValueData
            |BooleanValueData
            |IntegerValueData
            |DecimalValueData
            |StringChoiceValueData
            |IntegerChoiceValueData
            |InvalidValueData
            |Optional $configured = new Optional(),
    ) {}
}
