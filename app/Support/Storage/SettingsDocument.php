<?php

declare(strict_types=1);

namespace App\Support\Storage;

use JsonSerializable;
use PhpOption\Option;

/**
 * The stored overrides of one settings owner: its setting entries and its toggle entries, each keyed by local key in
 * the order they were stored. Changing one entry keeps every other entry as stored, unknown keys included.
 */
final readonly class SettingsDocument implements JsonSerializable
{
    public const int MOST_BYTES = 512 * 1024;

    /**
     * @param  array<string, EncodedSetting>  $settings  by local key
     * @param  array<string, EncodedToggle>  $toggles  by local key
     */
    public function __construct(private array $settings, private array $toggles) {}

    public static function empty(): self
    {
        return new self([], []);
    }

    /**
     * @return Option<EncodedSetting>
     */
    public function setting(string $key): Option
    {
        return Option::fromArraysValue($this->settings, $key);
    }

    /**
     * @return Option<EncodedToggle>
     */
    public function toggle(string $key): Option
    {
        return Option::fromArraysValue($this->toggles, $key);
    }

    /**
     * The document with this entry stored in place of the one with its key, or added at the end.
     */
    public function withSetting(EncodedSetting $setting): self
    {
        return new self([
            ...$this->settings,
            $setting->key => $setting,
        ], $this->toggles);
    }

    public function withoutSetting(string $key): self
    {
        return new self(array_diff_key($this->settings, [$key => true]), $this->toggles);
    }

    /**
     * The document with this entry stored in place of the one with its key, or added at the end.
     */
    public function withToggle(EncodedToggle $toggle): self
    {
        return new self($this->settings, [
            ...$this->toggles,
            $toggle->key => $toggle,
        ]);
    }

    public function withoutToggle(string $key): self
    {
        return new self($this->settings, array_diff_key($this->toggles, [$key => true]));
    }

    public function toJson(): string
    {
        return json_encode($this, EncodedValue::JSON_FLAGS);
    }

    /**
     * @return array{settings: list<EncodedSetting>, toggles: list<EncodedToggle>}
     */
    public function jsonSerialize(): array
    {
        return [
            'settings' => array_values($this->settings),
            'toggles' => array_values($this->toggles),
        ];
    }
}
