<?php

declare(strict_types=1);

namespace App\Settings\Values;

use App\Settings\Exceptions\SettingDeclarationInvalid;
use App\Settings\Support\SettingKey;

/**
 * One option of a choice setting: the text or whole number stored and the label shown for it.
 *
 * @template-covariant TValue of string|int
 */
final readonly class Choice
{
    /**
     * @param  TValue  $value
     */
    private function __construct(public string|int $value, public string $label) {}

    /**
     * @template TOption of string|int
     *
     * @param  TOption  $value
     * @return self<TOption>
     *
     * @throws SettingDeclarationInvalid
     */
    public static function make(string|int $value, string $label): self
    {
        if (! SettingKey::labelFits($label)) {
            throw SettingDeclarationInvalid::badChoiceLabel(SettingKey::LABEL_CHARACTERS);
        }

        return new self($value, $label);
    }
}
