<?php

declare(strict_types=1);

namespace App\Settings\Declarations;

use App\Settings\Contracts\CatalogueConstraints;
use App\Settings\Contracts\CatalogueValue;
use App\Settings\Contracts\Setting;
use App\Settings\Data\BooleanValueData;
use App\Settings\Enums\SettingType;
use App\Settings\Exceptions\SettingDeclarationInvalid;
use App\Settings\Support\SettingKey;
use App\Settings\Values\Decimal;
use BackedEnum;
use Spatie\LaravelData\Optional;

/**
 * A setting that is on or off.
 */
final readonly class BooleanSetting implements Setting
{
    private function __construct(public string $key, public string $label, public bool $default) {}

    /**
     * @throws SettingDeclarationInvalid
     */
    public static function make(string $key, string $label, bool $default): self
    {
        SettingKey::require($key, $label);

        return new self($key, $label, $default);
    }

    public function key(): string
    {
        return $this->key;
    }

    public function label(): string
    {
        return $this->label;
    }

    public function type(): SettingType
    {
        return SettingType::Boolean;
    }

    public function defaultValue(): bool
    {
        return $this->default;
    }

    public function catalogueValue(string|bool|int|Decimal|BackedEnum $settingInput): CatalogueValue
    {
        return BooleanValueData::from(['value' => $settingInput]);
    }

    public function catalogueConstraints(): CatalogueConstraints|Optional
    {
        return Optional::create();
    }
}
