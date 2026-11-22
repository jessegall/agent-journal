<?php

declare(strict_types=1);

namespace App\Support\Storage;

use JsonSerializable;

/**
 * One stored toggle group state: the group's local key and its state as stored, not yet checked to be a boolean.
 */
final readonly class EncodedToggle implements JsonSerializable
{
    public function __construct(public string $key, public EncodedValue $encodedToggle) {}

    /**
     * @return array{key: string, value: EncodedValue}
     */
    public function jsonSerialize(): array
    {
        return ['key' => $this->key, 'value' => $this->encodedToggle];
    }
}
