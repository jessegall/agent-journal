<?php

declare(strict_types=1);

namespace App\Declarations;

use App\Contracts\CatalogueConstraints;
use App\Contracts\CatalogueValue;
use App\Contracts\Setting;
use App\Data\BooleanValueData;
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

    public function catalogueValue(string|bool|int|Decimal|BackedEnum $input): CatalogueValue
    {
        return BooleanValueData::from(['value' => $input]);
    }

    public function catalogueConstraints(): CatalogueConstraints|Optional
    {
        return Optional::create();
    }
}
