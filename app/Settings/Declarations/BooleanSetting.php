<?php

declare(strict_types=1);

namespace App\Settings\Declarations;

use App\Settings\Contracts\Setting;
use App\Settings\Enums\SettingType;
use App\Settings\Exceptions\SettingDeclarationInvalid;
use App\Settings\Support\SettingKey;

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
}
