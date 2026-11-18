<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use App\Domains\Support\DomainEntry;

/**
 * A domain or Core, with the namespace it owns and the types it exports.
 */
final readonly class PublicOwner
{
    private const string CORE = 'Core';

    /**
     * @param  list<string>  $exports
     */
    public function __construct(
        public string $name,
        public string $namespace,
        public array $exports,
    ) {}

    public static function fromDomain(DomainEntry $entry): self
    {
        return new self($entry->name, $entry->namespace, $entry->exports);
    }

    /**
     * @param  list<string>  $exports  CoreApi's list
     */
    public static function core(array $exports): self
    {
        return new self(self::CORE, 'App\\', $exports);
    }

    public function isCore(): bool
    {
        return $this->name === self::CORE;
    }

    public function exportsName(string $name): bool
    {
        return in_array(strtolower(ltrim($name, '\\')), array_map(strtolower(...), $this->exports), true);
    }

    public function ownsName(string $name): bool
    {
        return stripos(ltrim($name, '\\'), rtrim($this->namespace, '\\').'\\') === 0;
    }
}
