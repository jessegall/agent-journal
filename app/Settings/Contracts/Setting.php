<?php

declare(strict_types=1);

namespace App\Settings\Contracts;

use App\Settings\Enums\SettingType;
use App\Settings\Values\Decimal;
use BackedEnum;
use Spatie\LaravelData\Optional;

/**
 * One declared setting: its key within its owner, its label and the type of value it holds. Exported because a group
 * lists its settings by it.
 */
interface Setting
{
    public function key(): string;

    public function label(): string;

    public function type(): SettingType;

    /**
     * The value the setting has while nobody changed it.
     */
    public function defaultValue(): string|bool|int|Decimal|BackedEnum;

    /**
     * A value of this setting as the settings catalogue shows it.
     */
    public function catalogueValue(string|bool|int|Decimal|BackedEnum $settingInput): CatalogueValue;

    /**
     * The setting's limits as the settings catalogue shows them; a setting without limits shows none.
     */
    public function catalogueConstraints(): CatalogueConstraints|Optional;
}
