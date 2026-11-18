<?php

declare(strict_types=1);

namespace App\Settings\Declarations;

use App\Settings\Contracts\GroupDeclaration;
use App\Settings\Contracts\Setting;
use App\Settings\Exceptions\SettingDeclarationInvalid;
use App\Settings\Support\SettingKey;

/**
 * A named group of settings that can be switched on and off as a whole; while it is off, its settings do not apply.
 */
final readonly class ToggleGroup implements GroupDeclaration
{
    /**
     * @param  list<Setting>  $settings
     */
    private function __construct(public string $key, public string $label, public bool $defaultEnabled, public array $settings) {}

    /**
     * @param  list<Setting>  $settings
     *
     * @throws SettingDeclarationInvalid
     */
    public static function make(string $key, string $label, bool $defaultEnabled, array $settings): self
    {
        SettingKey::require($key, $label);

        return new self($key, $label, $defaultEnabled, $settings);
    }

    public function key(): string
    {
        return $this->key;
    }

    public function label(): string
    {
        return $this->label;
    }

    public function settings(): array
    {
        return $this->settings;
    }
}
