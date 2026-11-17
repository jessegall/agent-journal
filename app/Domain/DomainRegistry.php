<?php

declare(strict_types=1);

namespace App\Domain;

use App\Core\Assignments\Contracts\AssignmentRegistration;
use App\Core\Hooks\Contracts\StateRegistration;
use App\Core\Ui\Declarations\DomainUi;
use App\Core\Ui\Support\UiDeclarations;
use App\Domain\Contracts\ProvidesStates;
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
     * Registers the states every domain declares through ProvidesStates, each factory built by the container.
     */
    public function registerStatesIn(StateRegistration $registration, Container $container): void
    {
        foreach ($this->all() as $entry) {
            if (! $entry->domain instanceof ProvidesStates) {
                continue;
            }

            foreach ($entry->domain->states() as $typeKey => $factory) {
                $registration->register($typeKey, $container->make($factory));
            }
        }
    }

    /**
     * The pages, navigation and sections every domain declares through ProvidesPages, ProvidesNavigation and
     * ProvidesSections, checked together with Core's own; a domain that declares none of them adds nothing.
     */
    public function uiDeclarations(DomainUi ...$coreDeclarations): UiDeclarations
    {
        return UiDeclarations::check(array_values([...$coreDeclarations, ...array_map(fn (DomainEntry $entry) => $entry->ui(), $this->all())]));
    }

    /**
     * Registers the assignable record types and the actor types able to hold records that domains declare; a domain
     * that declares neither is left out.
     */
    public function registerAssignmentsIn(AssignmentRegistration $registration): void
    {
        foreach ($this->all() as $entry) {
            foreach ($entry->assignables() as $type => $providerClass) {
                $registration->registerRecord($type, $providerClass);
            }

            foreach ($entry->assignees() as $assignees) {
                $registration->registerAssignees($assignees);
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
