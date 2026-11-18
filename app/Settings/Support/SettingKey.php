<?php

declare(strict_types=1);

namespace App\Settings\Support;

use App\Settings\Exceptions\SettingDeclarationInvalid;

/**
 * The one check of a setting's or group's key and label: a key is lowercase letters, digits and underscores, starts
 * with a letter and is at most 64 characters; a label is 1 to 200 characters.
 */
final class SettingKey
{
    private const string KEY_PATTERN = '/^[a-z][a-z0-9_]{0,63}$/';

    private const int LABEL_CHARACTERS = 200;

    /**
     * @throws SettingDeclarationInvalid
     */
    public static function require(string $key, string $label): void
    {
        if (preg_match(self::KEY_PATTERN, $key) !== 1) {
            throw SettingDeclarationInvalid::badKey($key);
        }

        if (trim($label) === '') {
            throw SettingDeclarationInvalid::emptyLabel($key);
        }

        if (mb_strlen($label) > self::LABEL_CHARACTERS) {
            throw SettingDeclarationInvalid::labelTooLong($key);
        }
    }
}
