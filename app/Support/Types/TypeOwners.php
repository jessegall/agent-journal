<?php

declare(strict_types=1);

namespace App\Support\Types;

use App\Contracts\Actors\Actor;
use App\Exceptions\TypeOwnerRepeated;
use App\Support\ClientDeclarations;
use App\Support\DomainRegistry;
use Illuminate\Support\Str;

/**
 * Which owner a PHP class's generated TypeScript type belongs to: the Core page owner that names it, the installed
 * domain whose namespace holds it, or Core; anything else is shared.
 */
final readonly class TypeOwners
{
    /**
     * @param  array<string, string>  $owners  owner key by namespace prefix, longest prefix first
     * @param  array<string, string>  $claims  owner key by class, for the types a Core page owner names
     */
    private function __construct(private array $owners, private array $claims) {}

    /**
     * @throws TypeOwnerRepeated when two page owners claim one class, or one owner two types of the same name
     */
    public static function of(DomainRegistry $registry, ClientDeclarations $declarations): self
    {
        // Core's root namespace, read from one of the types Core publishes.
        $coreRoot = implode('\\', array_slice(explode('\\', Actor::class), 0, 1)).'\\';
        $owners = [$coreRoot => 'core'];

        foreach ($registry->all() as $entry) {
            $owners[$entry->namespace.'\\'] = Str::kebab($entry->name);
        }

        uksort($owners, fn (string $one, string $other) => strlen($other) <=> strlen($one));

        return new self($owners, self::claims($declarations));
    }

    public function ownerOf(string $className): string
    {
        if (array_key_exists($className, $this->claims)) {
            return $this->claims[$className];
        }

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
        $keys = array_values(array_unique([...array_values($this->owners), ...array_values($this->claims), 'shared']));

        sort($keys);

        return $keys;
    }

    /**
     * The owner of each class a Core page owner names as its own, such as the Accounts page data under accounts.
     *
     * @return array<string, string>
     */
    private static function claims(ClientDeclarations $declarations): array
    {
        $claims = [];

        foreach ($declarations->owners() as $owner) {
            $symbols = [];

            foreach ($owner->types as $className) {
                if (array_key_exists($className, $claims)) {
                    throw TypeOwnerRepeated::forClass($className, $claims[$className], $owner->key);
                }

                if (in_array(class_basename($className), $symbols, true)) {
                    throw TypeOwnerRepeated::forSymbol(class_basename($className), $owner->key);
                }

                $claims[$className] = $owner->key;
                $symbols[] = class_basename($className);
            }
        }

        return $claims;
    }
}
