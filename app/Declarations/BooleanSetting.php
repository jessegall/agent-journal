<?php

declare(strict_types=1);

namespace App\Declarations;

use App\Contracts\Settings\CatalogueConstraints;
use App\Contracts\Settings\CatalogueValue;
use App\Contracts\Settings\Setting;
use App\Data\Settings\BooleanValueData;
use App\Enums\SettingType;
use App\Exceptions\SettingDeclarationInvalid;
use App\Support\SettingKey;
use App\Values\Decimal;
use BackedEnum;
use Spatie\LaravelData\Optional;

/**
 * A setting that is on or off.
 */
final readonly class BooleanSetting implements Setting
{
    private function __construct(
        public string $key,
        public string $label,
        public bool $isDefault,
        public string|null $description = null,
    ) {}

    /**
     * @throws SettingDeclarationInvalid
     */
    public static function make(string $key, string $label, bool $default, string|null $description = null): self
    {
        SettingKey::require($key, $label);

        return new self($key, $label, $default, $description);
    }

    public function key(): string
    {
        return $this->key;
    }

    public function label(): string
    {
        return $this->label;
    }

    /**
     * The sentence the settings page shows under the label; null when the label says it all.
     */
    public function description(): string|null
    {
        return $this->description;
    }

    public function type(): SettingType
    {
        return SettingType::Boolean;
    }

    public function isEnabledByDefault(): bool
    {
        return $this->isDefault;
    }

    public function catalogueValue(string|bool|int|Decimal|BackedEnum $input): CatalogueValue
    {
        return BooleanValueData::from(['value' => $input]);
    }

    public function catalogueConstraints(): CatalogueConstraints|Optional
    {
        return Optional::create();
    }
}
