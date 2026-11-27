<?php

declare(strict_types=1);

namespace App\Hosts\Values;

use App\Hosts\Exceptions\HostFieldTypeUnknown;

/**
 * One field's type as protocol/host.json writes it: a name (a scalar, an enum or another type of the file), a list<T>
 * or a map<T> of string keys, "|null" when it is there but may be null, and a trailing "?" when it may be left out.
 */
final readonly class HostFieldType
{
    private function __construct(
        public string $name,
        public bool $isNullable,
        public bool $isOptional,
        public self|null $item = null,
        public bool $isMap = false,
    ) {}

    /**
     * @throws HostFieldTypeUnknown
     */
    public static function parse(string $text): self
    {
        $isOptional = str_ends_with($text, '?');
        $type = rtrim($text, '?');
        $isNullable = str_ends_with($type, '|null');
        $type = $isNullable ? substr($type, 0, -strlen('|null')) : $type;

        if (preg_match('/^(list|map)<(.+)>$/', $type, $collection) === 1) {
            $item = self::parse($collection[2]);

            return new self($collection[1], $isNullable, $isOptional, $item, $collection[1] === 'map');
        }

        if (preg_match('/^[a-z][a-z0-9_]*$/', $type) !== 1) {
            throw HostFieldTypeUnknown::of($text);
        }

        return new self($type, $isNullable, $isOptional);
    }

    public function isCollection(): bool
    {
        return $this->item !== null;
    }
}
