<?php

declare(strict_types=1);

namespace App\Domains\Support;

use App\Domains\Bootstrappers\LoadMigrations;
use App\Domains\Concerns\HasAssignables;
use App\Domains\Concerns\HasNumberedModels;
use App\Domains\Concerns\HasStates;
use App\Domains\Contracts\DomainBootstrapper;
use App\Domains\Contracts\ProvidesAssignables;
use App\Domains\Contracts\ProvidesAssignees;
use App\Domains\Contracts\ProvidesStates;
use App\Domains\Exceptions\CapabilityWithoutTrait;
use App\Exports\Support\Exports;
use App\Numbers\Contracts\ProvidesNumberedModels;

/**
 * One domain of the application: what it owns, the domains it may use, and the steps its boot runs. Every domain loads
 * its migrations; each trait it uses adds the steps of its capability, found the Laravel way by a method named
 * bootstrappers<TraitName>; the domain adds its own one-off steps in bootstrappers().
 */
abstract class Domain
{
    /**
     * The capability interfaces that need a trait to boot, each with that trait.
     */
    private const array TRAIT_OF_CAPABILITY = [
        ProvidesAssignables::class => HasAssignables::class,
        ProvidesAssignees::class => HasAssignables::class,
        ProvidesStates::class => HasStates::class,
        ProvidesNumberedModels::class => HasNumberedModels::class,
    ];

    abstract public function description(): string;

    /**
     * The steps this domain adds itself, after the ones its traits bring; none unless it overrides this.
     *
     * @return list<class-string<DomainBootstrapper>>
     */
    public function bootstrappers(): array
    {
        return [];
    }

    /**
     * @return list<class-string<Domain>>
     */
    abstract public function requires(): array;

    /**
     * Whether the owner may switch this domain off; a domain the journal cannot run without answers false.
     */
    public function canDisable(): bool
    {
        return true;
    }

    /**
     * The domain's public surface, sorted into events, contracts, values, commands and exceptions, each name written out
     * one by one. Empty exports are a domain nothing outside may use; there is no wildcard.
     */
    abstract public function exports(): Exports;

    /**
     * Every step the domain's boot runs, in order: its migrations, its traits' steps, then its own.
     *
     * @return list<class-string<DomainBootstrapper>>
     *
     * @throws CapabilityWithoutTrait
     */
    final public function bootSteps(): array
    {
        $traits = class_uses_recursive(static::class);
        $fromTraits = [];

        foreach (self::TRAIT_OF_CAPABILITY as $capability => $trait) {
            if ($this instanceof $capability && ! in_array($trait, $traits, true)) {
                throw CapabilityWithoutTrait::for(static::class, $capability, $trait);
            }
        }

        foreach ($traits as $trait) {
            $method = 'bootstrappers'.class_basename($trait);

            if (method_exists($this, $method)) {
                array_push($fromTraits, ...$this->{$method}());
            }
        }

        return array_values(array_unique([LoadMigrations::class, ...$fromTraits, ...$this->bootstrappers()]));
    }
}
