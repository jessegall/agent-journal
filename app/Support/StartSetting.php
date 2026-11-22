<?php

declare(strict_types=1);

namespace App\Support;

use JsonSerializable;

/**
 * One named value a host sets for a start: an environment variable or an entry of the account's own configuration.
 */
final readonly class StartSetting implements JsonSerializable
{
    public function __construct(
        public string $name,
        public string $settingText,
    ) {}

    /**
     * @return array{name: string, value: string}
     */
    public function jsonSerialize(): array
    {
        return ['name' => $this->name, 'value' => $this->settingText];
    }
}
