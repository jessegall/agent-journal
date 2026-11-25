<?php

declare(strict_types=1);

namespace App\Support;

use App\Data\Settings\BooleanValueData;
use App\Data\Settings\IntegerValueData;
use App\Data\Settings\InvalidValueData;
use App\Data\Settings\SettingData;
use App\Data\Settings\StringChoiceValueData;
use App\Data\Settings\StringValueData;
use App\Enums\Settings\SettingType;
use Spatie\LaravelData\Optional;

/**
 * A setting's value as text a form holds: the configured one when it has one, else its default. A setting whose stored
 * value is invalid, or whose kind the form does not edit, has none.
 */
final class SettingsValues
{
    public static function textOf(SettingData $setting): string|null
    {
        $value = $setting->configured instanceof Optional ? $setting->default : $setting->configured;

        return match (true) {
            $value instanceof StringValueData => $value->settingText,
            $value instanceof BooleanValueData => $value->isEnabled ? '1' : '0',
            $value instanceof IntegerValueData => (string) $value->settingNumber,
            $value instanceof StringChoiceValueData => $value->selectedKey,
            $value instanceof InvalidValueData => null,
            default => null,
        };
    }

    /**
     * Whether the form edits this kind of setting: text, on or off, whole numbers and text choices.
     */
    public static function isEditable(SettingData $setting): bool
    {
        return in_array($setting->type, [
            SettingType::String,
            SettingType::Boolean,
            SettingType::Integer,
        ], true)
            || $setting->default instanceof StringChoiceValueData;
    }
}
