<?php

declare(strict_types=1);

namespace App\Core\Web\Types;

use App\Core\Contracts\Actor;
use App\Core\Ui\Support\UiDeclarations;
use App\Domain\DomainRegistry;
use Illuminate\Support\Str;

/**
 * Which owner a PHP class's generated TypeScript type belongs to: Core, the installed domain or the page owner whose
 * namespace holds it, such as Core's Web; anything else is shared.
 */
final readonly class TypeOwners
{
    /**
     * @param  array<string, string>  $owners  owner key by namespace prefix, longest prefix first
     */
    private function __construct(private array $owners) {}

    public static function of(DomainRegistry $registry, UiDeclarations $declarations): self
    {
        // Core's root namespace, read from one of the types Core publishes.
        $coreRoot = implode('\\', array_slice(explode('\\', Actor::class), 0, 2)).'\\';
        $owners = [$coreRoot => 'core'];

        foreach ($registry->all() as $entry) {
            $owners[$entry->namespace.'\\'] = Str::kebab($entry->name);
        }

        // Core's own pages, such as Web's, own their types under their key rather than Core's.
        foreach ($declarations->owners() as $owner) {
            $owners[$owner->namespace.'\\'] = $owner->key;
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
