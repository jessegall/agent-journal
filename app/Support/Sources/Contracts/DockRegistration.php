<?php

declare(strict_types=1);

namespace App\Support\Sources\Contracts;

use App\Exceptions\DockDefinitionInvalid;
use App\Support\Sources\DockDefinition;

/**
 * Where an owner registers what a conversation may dock, once per type, at boot, and asks for Add to chat to be
 * offered on its sources. Every record type with no owner registration is dockable through its fallback card.
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

    public function offerDockFor(DockDefinition $definition): void;

    /**
     * The owner's definition of the type, else the fallback of its record type.
     *
     * @throws DockDefinitionInvalid
     */
    public function definition(string $type): DockDefinition;

    public function offersDock(string $type): bool;
}
