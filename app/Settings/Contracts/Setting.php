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
    /**
     * The key the setting is stored and read under.
     */
    public function key(): string;

    /**
     * The name users see for the setting.
     */
    public function label(): string;

    /**
     * The sentence the settings page shows under the label; null when the label says it all.
     */
    public function description(): string|null;

    /**
     * Whether the setting holds text, a whole number, a decimal or a yes or no.
     */
    public function type(): SettingType;

    /**
     * The value the setting has while nobody changed it.
     */
    public function isEnabledByDefault(): string|bool|int|Decimal|BackedEnum;

    /**
     * A value of this setting as the settings catalogue shows it.
     */
    public function catalogueValue(string|bool|int|Decimal|BackedEnum $settingInput): CatalogueValue;

    /**
     * The setting's limits as the settings catalogue shows them; a setting without limits shows none.
     */
    public function catalogueConstraints(): CatalogueConstraints|Optional;
}
