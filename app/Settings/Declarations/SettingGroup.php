<?php

declare(strict_types=1);

namespace App\Settings\Declarations;

use App\Navigation\Contracts\GroupDeclaration;
use App\Settings\Contracts\Setting;
use App\Settings\Exceptions\SettingDeclarationInvalid;
use App\Settings\SettingKey;

/**
 * A named group of settings, always enabled.
 */
final readonly class SettingGroup implements GroupDeclaration
{
    /**
     * @param  list<Setting>  $settings
     */
    private function __construct(
        public string $key,
        public string $label,
        public array $settings,
        public string|null $description = null,
    ) {}

    /**
     * @param  list<Setting>  $settings
     *
     * @throws SettingDeclarationInvalid
     */
    public static function make(string $key, string $label, array $settings, string|null $description = null): self
    {
        SettingKey::require($key, $label);

        return new self($key, $label, $settings, $description);
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

    /**
     * @return list<Setting>
     */
    public function settings(): array
    {
        return $this->settings;
    }
}
