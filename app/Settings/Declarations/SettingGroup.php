<?php

declare(strict_types=1);

namespace App\Settings\Declarations;

use App\Settings\Contracts\Setting;
use App\Settings\Exceptions\SettingDeclarationInvalid;
use App\Settings\Support\SettingKey;

/**
 * A named group of settings, always enabled.
 */
final readonly class SettingGroup
{
    /**
     * @param  list<Setting>  $settings
     */
    private function __construct(public string $key, public string $label, public array $settings) {}

    /**
     * @param  list<Setting>  $settings
     *
     * @throws SettingDeclarationInvalid
     */
    public static function make(string $key, string $label, array $settings): self
    {
        SettingKey::require($key, $label);

        return new self($key, $label, $settings);
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
     * @return list<Setting>
     */
    public function settings(): array
    {
        return $this->settings;
    }
}
