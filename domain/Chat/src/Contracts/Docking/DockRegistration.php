<?php

declare(strict_types=1);

namespace Domain\Chat\Contracts\Docking;

use Domain\Chat\Exceptions\DockDefinitionInvalid;
use Domain\Chat\Values\DockDefinition;

/**
 * Where the chat registers the cards of its own sources, once per type, at boot. Every record type with no registration
 * of its own is dockable through its fallback: its owner's summary, else its link card.
 */
interface DockRegistration
{
    /**
     * @param  string  $class  a class name, refused unless it is a Dockable
     * @param  string  $provider  a class name, refused unless it is a DockableProvider
     *
     * @throws DockDefinitionInvalid
     */
    public function register(string $type, string $class, string $provider): DockDefinition;

    /**
     * The owner's definition of the type, else the fallback of its record type.
     *
     * @throws DockDefinitionInvalid
     */
    public function definition(string $type): DockDefinition;

    /**
     * Whether records of the type may be docked.
     */
    public function offersDock(string $type): bool;
}
