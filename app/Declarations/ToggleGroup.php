<?php

declare(strict_types=1);

namespace App\Declarations;

use App\Contracts\Navigation\GroupDeclaration;
use App\Contracts\Settings\Setting;
use App\Exceptions\SettingDeclarationInvalid;
use App\Support\SettingKey;

/**
 * A named group of settings that can be switched on and off as a whole; while it is off, its settings do not apply.
 */
final readonly class ToggleGroup implements GroupDeclaration
{
    /**
     * @param  list<Setting>  $settings
     */
    private function __construct(
        public string $key,
        public string $label,
        public bool $isDefaultEnabled,
        public array $settings,
        public string|null $description = null,
    ) {}

    /**
     * @param  list<Setting>  $settings
     *
     * @throws SettingDeclarationInvalid
     */
    public static function make(
        string $key,
        string $label,
        bool $isDefaultEnabled,
        array $settings,
        string|null $description = null,
    ): self {
        SettingKey::require($key, $label);

        return new self($key, $label, $isDefaultEnabled, $settings, $description);
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
     * The sentence the settings page shows under the group's heading; null when the heading says it all.
     */
    public function description(): string|null
    {
        return $this->description;
    }

    public function settings(): array
    {
        return $this->settings;
    }
}
