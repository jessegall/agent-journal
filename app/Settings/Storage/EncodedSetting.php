<?php

declare(strict_types=1);

namespace App\Settings\Storage;

use JsonSerializable;

/**
 * One stored setting override: the setting's local key and its value as stored, not yet checked against a declaration.
 */
final readonly class EncodedSetting implements JsonSerializable
{
    public function __construct(public string $key, public EncodedValue $value) {}

    /**
     * @return array{key: string, value: EncodedValue}
     */
    public function jsonSerialize(): array
    {
        return ['key' => $this->key, 'value' => $this->value];
    }
}
