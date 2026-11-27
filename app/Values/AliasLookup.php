<?php

declare(strict_types=1);

namespace App\Values;

/**
 * A saved alias as a lookup finds it: its body, revision, digest and declared positional arguments.
 */
final readonly class AliasLookup
{
    /**
     * @param  list<string>  $arguments  the names of the positional arguments the body takes
     */
    private function __construct(
        public string $name,
        public string $id,
        public string $body,
        public int $revision,
        public string $digest,
        public array $arguments,
    ) {}

    /**
     * @param  list<string>  $arguments
     */
    public static function found(
        string $id,
        string $name,
        string $body,
        int $revision,
        string $digest,
        array $arguments,
    ): self {
        return new self($name, $id, $body, $revision, $digest, $arguments);
    }

    public function reference(): string
    {
        return "alias:{$this->name}#{$this->id}@{$this->revision}";
    }
}
