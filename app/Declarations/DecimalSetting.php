<?php

declare(strict_types=1);

namespace App\Declarations;

use App\Contracts\Settings\CatalogueConstraints;
use App\Contracts\Settings\CatalogueValue;
use App\Contracts\Settings\Setting;
use App\Data\Settings\DecimalConstraintsData;
use App\Data\Settings\DecimalValueData;
use App\Enums\SettingType;
use App\Exceptions\DecimalInvalid;
use App\Exceptions\SettingDeclarationInvalid;
use App\Support\SettingKey;
use App\Values\Decimal;
use BackedEnum;
use Spatie\LaravelData\Optional;

/**
 * An exact decimal setting with a fixed number of digits and fractional digits, and optional bounds. A value with
 * more fractional digits is refused, never rounded.
 */
final readonly class DecimalSetting implements Setting
{
    public const int MOST_DIGITS = 30;

    public const int MOST_FRACTIONAL_DIGITS = 12;

    /**
     * @param  int<1, max>  $precision
     * @param  int<0, max>  $scale
     */
    private function __construct(
        public string $key,
        public string $label,
        public Decimal $default,
        public int $precision,
        public int $scale,
        public Decimal|null $minimum,
        public Decimal|null $maximum,
        public string|null $description = null,
    ) {}

    /**
     * @throws SettingDeclarationInvalid
     */
    public static function make(
        string $key,
        string $label,
        Decimal $default,
        int $precision,
        int $scale,
        Decimal|null $minimum = null,
        Decimal|null $maximum = null,
        string|null $description = null,
    ): self {
        SettingKey::require($key, $label);

        if ($precision < 1
            || $precision > self::MOST_DIGITS
            || $scale < 0
            || $scale > self::MOST_FRACTIONAL_DIGITS
            || $scale > $precision) {
            throw SettingDeclarationInvalid::badDigits($key, self::MOST_DIGITS, self::MOST_FRACTIONAL_DIGITS);
        }

        if ($minimum !== null && $maximum !== null && $minimum->isGreaterThan($maximum)) {
            throw SettingDeclarationInvalid::badBounds($key);
        }

        $setting = new self($key, $label, $default, $precision, $scale, $minimum, $maximum, $description);

        try {
            $normalizedDefault = $setting->normalized($default);
        } catch (DecimalInvalid $cause) {
            throw SettingDeclarationInvalid::defaultOutOfBounds($key, previous: $cause);
        }

        return new self($key, $label, $normalizedDefault, $precision, $scale, $minimum, $maximum, $description);
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
        return SettingType::Decimal;
    }

    /**
     * The value written at this setting's scale, refused when it has more fractional digits, more digits than the
     * precision allows, or lies outside the bounds.
     *
     * @throws DecimalInvalid
     */
    public function normalized(Decimal $input): Decimal
    {
        $scaled = $input->toScale($this->scale);

        if ($scaled->precision() > $this->precision) {
            throw DecimalInvalid::tooManyDigits($this->precision);
        }

        if ($this->minimum !== null
            && $scaled->isLessThan($this->minimum)
            || $this->maximum !== null
            && $scaled->isGreaterThan($this->maximum)) {
            throw DecimalInvalid::outOfBounds();
        }

        return $scaled;
    }

    public function defaultValue(): Decimal
    {
        return $this->default;
    }

    public function catalogueValue(string|bool|int|Decimal|BackedEnum $input): CatalogueValue
    {
        return DecimalValueData::from([
            'value' => $input instanceof Decimal ? $input->text : $input,
        ]);
    }

    public function catalogueConstraints(): CatalogueConstraints|Optional
    {
        $limits = [
            'precision' => $this->precision,
            'scale' => $this->scale,
            'minimum' => $this->minimum?->text,
            'maximum' => $this->maximum?->text,
        ];

        return DecimalConstraintsData::from(array_filter($limits, fn (int|string|null $limit) => $limit !== null));
    }
}
