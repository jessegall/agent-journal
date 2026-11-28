<?php

declare(strict_types=1);

namespace App\Settings\Storage;

use JsonSerializable;

/**
 * One stored entry of a settings document, a setting override or a toggle group's state: its local key and its value
 * as stored, not yet checked against a declaration.
 */
final readonly class EncodedEntry implements JsonSerializable
{
    public function __construct(public string $key, public EncodedValue $value) {}

    /**
     * @return array{key: string, value: EncodedValue}
     */
    public function jsonSerialize(): array
    {
        return [
            'key' => $this->key,
            'value' => $this->value,
        ];
    }
}
