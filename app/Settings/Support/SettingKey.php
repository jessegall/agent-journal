<?php

declare(strict_types=1);

namespace App\Settings\Support;

use App\Settings\Exceptions\SettingDeclarationInvalid;

/**
 * The one check of a setting's or group's key and label: a key is lowercase letters, digits and underscores, starts
 * with a letter and has at most KEY_CHARACTERS; a label is not empty and has at most LABEL_CHARACTERS.
 */
final class SettingKey
{
    public const int KEY_CHARACTERS = 64;

    public const int LABEL_CHARACTERS = 200;

    /**
     * @throws SettingDeclarationInvalid
     */
    public static function require(string $key, string $label): void
    {
        if (preg_match('/^[a-z][a-z0-9_]*$/', $key) !== 1 || strlen($key) > self::KEY_CHARACTERS) {
            throw SettingDeclarationInvalid::badKey($key, self::KEY_CHARACTERS);
        }

        if (trim($label) === '') {
            throw SettingDeclarationInvalid::emptyLabel($key);
        }

        if (mb_strlen($label) > self::LABEL_CHARACTERS) {
            throw SettingDeclarationInvalid::labelTooLong($key, self::LABEL_CHARACTERS);
        }
    }
}
