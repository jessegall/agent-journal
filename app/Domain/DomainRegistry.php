<?php

declare(strict_types=1);

namespace App\Domain;

use App\Core\Hooks\Contracts\StateRegistration;
use App\Domain\Contracts\RegistersStates;
use App\Domain\Exceptions\AmbiguousDomainRoot;
use App\Domain\Exceptions\DomainCycle;
use App\Domain\Exceptions\DomainListedTwice;
use App\Domain\Exceptions\DomainNotFound;
use App\Domain\Exceptions\RequiredDomainMissing;
use Illuminate\Contracts\Container\Container;

/**
 * Every registered domain by name, checked once when the list is read and never changed after.
 */
final readonly class DomainRegistry
{
    /**
     * @param  array<string, DomainEntry>  $entries
     */
    private function __construct(private array $entries) {}

    /**
     * @param  list<string>  $classNames
     */
    public static function from(array $classNames): self
    {
        $entries = [];

        foreach ($classNames as $className) {
            $entry = DomainEntry::fromClass($className);

            if (array_key_exists($entry->name, $entries)) {
                throw DomainListedTwice::for($entry->name);
            }

            foreach ($entries as $earlier) {
                if ($earlier->overlaps($entry)) {
                    throw AmbiguousDomainRoot::between($earlier->name, $entry->name);
                }
            }

            $entries[$entry->name] = $entry;
        }

        $listedClasses = array_map(fn (DomainEntry $entry) => $entry->className(), $entries);

        foreach ($entries as $entry) {
            foreach ($entry->requires as $requiredClass) {
                if (! in_array($requiredClass, $listedClasses, true)) {
                    throw RequiredDomainMissing::for($entry->name, DomainEntry::nameOf($requiredClass));
                }
            }
        }

        foreach ($entries as $entry) {
            self::refuseCycleFrom($entries, $entry, []);
        }

        return new self($entries);
    }

    /**
     * @return list<DomainEntry>
     */
    public function all(): array
    {
        return array_values($this->entries);
    }

    public function has(string $name): bool
    {
        return array_key_exists($name, $this->entries);
    }

    public function get(string $name): DomainEntry
    {
        return $this->entries[$name] ?? throw DomainNotFound::for($name);
    }

    /**
     * Registers the states every domain declares through RegistersStates, each factory built by the container.
     */
    public function registerStatesIn(StateRegistration $registration, Container $container): void
    {
        foreach ($this->all() as $entry) {
            if (! $entry->domain instanceof RegistersStates) {
                continue;
            }

            foreach ($entry->domain->states() as $typeKey => $factory) {
                $registration->register($typeKey, $container->make($factory));
            }
        }
    }

    /**
     * @return list<string>
     */
    public function listenerFolders(): array
    {
        return array_map(fn (DomainEntry $entry) => $entry->listenerFolder(), $this->all());
    }

    /**
     * Walks the required domains depth first and throws when the walk reaches a domain already on its path.
     *
     * @param  array<string, DomainEntry>  $entries
     * @param  list<string>  $path
     */
    private static function refuseCycleFrom(array $entries, DomainEntry $entry, array $path): void
    {
        $position = array_search($entry->name, $path, true);

        if ($position !== false) {
            throw DomainCycle::for([...array_slice($path, $position), $entry->name]);
        }

        foreach ($entry->requires as $requiredClass) {
            self::refuseCycleFrom($entries, $entries[DomainEntry::nameOf($requiredClass)], [...$path, $entry->name]);
        }
    }
}
