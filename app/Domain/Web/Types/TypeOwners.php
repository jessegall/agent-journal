<?php

declare(strict_types=1);

namespace App\Domain\Web\Types;

use App\Core\Contracts\Actor;
use App\Domain\DomainRegistry;
use Illuminate\Support\Str;

/**
 * Which owner a PHP class's generated TypeScript type belongs to: Core, or the installed domain whose namespace holds
 * it; anything else is shared.
 */
final readonly class TypeOwners
{
    /**
     * @param  array<string, string>  $owners  owner key by namespace prefix, longest prefix first
     */
    private function __construct(private array $owners) {}

    public static function of(DomainRegistry $registry): self
    {
        // Core's root namespace, read from one of the types Core publishes.
        $coreRoot = implode('\\', array_slice(explode('\\', Actor::class), 0, 2)).'\\';
        $owners = [$coreRoot => 'core'];

        foreach ($registry->all() as $entry) {
            $owners[$entry->namespace.'\\'] = Str::kebab($entry->name);
        }

        uksort($owners, fn (string $one, string $other) => strlen($other) <=> strlen($one));

        return new self($owners);
    }

    public function ownerOf(string $className): string
    {
        foreach ($this->owners as $prefix => $owner) {
            if (str_starts_with($className, $prefix)) {
                return $owner;
            }
        }

        return 'shared';
    }

    /**
     * Every owner key, in order.
     *
     * @return list<string>
     */
    public function keys(): array
    {
        $keys = array_values(array_unique([...array_values($this->owners), 'shared']));
        sort($keys);

        return $keys;
    }
}
