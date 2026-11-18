<?php

declare(strict_types=1);

namespace App\Settings\Declarations;

use App\Settings\Contracts\Setting;
use App\Settings\Enums\SettingType;
use App\Settings\Exceptions\SettingDeclarationInvalid;
use App\Settings\Support\SettingKey;

/**
 * A text setting: its default and the shortest and longest value it accepts, in UTF-8 bytes, never above 16 KiB.
 */
final readonly class StringSetting implements Setting
{
    public const int LONGEST = 16384;

    private function __construct(
        public string $key,
        public string $label,
        public string $default,
        public int $minimumLength,
        public int $maximumLength,
    ) {}

    /**
     * @throws SettingDeclarationInvalid
     */
    public static function make(string $key, string $label, string $default, int $minimumLength = 0, int $maximumLength = self::LONGEST): self
    {
        SettingKey::require($key, $label);

        if ($minimumLength < 0 || $maximumLength > self::LONGEST || $minimumLength > $maximumLength) {
            throw SettingDeclarationInvalid::badLengths($key);
        }

        $setting = new self($key, $label, $default, $minimumLength, $maximumLength);

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

    public function type(): SettingType
    {
        return SettingType::String;
    }

    /**
     * Whether a value is valid UTF-8 and within this setting's lengths.
     */
    public function accepts(string $value): bool
    {
        return mb_check_encoding($value, 'UTF-8') && strlen($value) >= $this->minimumLength && strlen($value) <= $this->maximumLength;
    }
}
