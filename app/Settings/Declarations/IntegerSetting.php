<?php

declare(strict_types=1);

namespace App\Settings\Declarations;

use App\Settings\Contracts\CatalogueConstraints;
use App\Settings\Contracts\CatalogueValue;
use App\Settings\Contracts\Setting;
use App\Settings\Data\IntegerConstraintsData;
use App\Settings\Data\IntegerValueData;
use App\Settings\Enums\SettingType;
use App\Settings\Exceptions\SettingDeclarationInvalid;
use App\Settings\SettingCodec;
use App\Settings\SettingKey;
use App\Settings\Storage\EncodedValue;
use App\Settings\Values\Decimal;
use BackedEnum;
use Spatie\LaravelData\Optional;

/**
 * A whole-number setting between its bounds, which never pass the largest integer a browser keeps exactly.
 */
final readonly class IntegerSetting implements Setting
{
    public const int LARGEST = 9007199254740991;

    public const int SMALLEST = -9007199254740991;

    private function __construct(
        public string $key,
        public string $label,
        public int $defaultValue,
        public int $minimum,
        public int $maximum,
        public string|null $description = null,
    ) {}

    /**
     * @throws SettingDeclarationInvalid
     */
    public static function make(
        string $key,
        string $label,
        int $default,
        int $minimum = self::SMALLEST,
        int $maximum = self::LARGEST,
        string|null $description = null,
    ): self {
        SettingKey::require($key, $label);

        if ($minimum < self::SMALLEST || $maximum > self::LARGEST || $minimum > $maximum) {
            throw SettingDeclarationInvalid::badBounds($key);
        }

        $setting = new self($key, $label, $default, $minimum, $maximum, $description);

        if (! $setting->accepts($default)) {
            throw SettingDeclarationInvalid::defaultOutOfBounds($key);
        }

        return $setting;
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
        return SettingType::Integer;
    }

    /**
     * Whether a value lies within this setting's bounds.
     */
    public function accepts(int $input): bool
    {
        return $input >= $this->minimum && $input <= $this->maximum;
    }

    public function isEnabledByDefault(): int
    {
        return $this->defaultValue;
    }

    public function decodedBy(SettingCodec $codec, string $owner, EncodedValue $input): int
    {
        return $codec->decodeInteger($owner, $this, $input);
    }

    public function catalogueValue(string|bool|int|Decimal|BackedEnum $input): CatalogueValue
    {
        return IntegerValueData::from(['value' => $input]);
    }

    public function catalogueConstraints(): CatalogueConstraints|Optional
    {
        return IntegerConstraintsData::from(['minimum' => $this->minimum, 'maximum' => $this->maximum]);
    }
}
