<?php

declare(strict_types=1);

namespace App\Domains\Support;

use App\Hooks\Declarations\StateEventDeclaration;
use App\Hooks\Declarations\StateEvents;
use App\Hooks\Declarations\StateMethod;
use App\Hooks\Declarations\StateMethods;
use App\Hooks\StateCatalog\StateTypeRegistry;
use App\Reflection\Contracts\ReflectorFactory;
use App\Reflection\Support\Reflector;

/**
 * Collects state listeners from loaders and checks the owners of their methods and source files.
 */
final readonly class StateListenerDeclarations
{
    public function __construct(private ListenerOwnership $ownership, private ReflectorFactory $reflectors) {}

    public function declarations(StateTypeRegistry $types, StateMethods $methods): StateEvents
    {
        $declarations = [];

        foreach ($types->loaders() as $loader) {
            foreach ($methods->eventsForLoader($loader) as $event => $method) {
                $owner = $this->ownerOf($event, $method);
                $declaration = new StateEventDeclaration($event, $method, $owner);
                $declarations[$declaration->cacheEntry()] = $declaration;
            }
        }

        return new StateEvents(array_values($declarations));
    }

    public function ownerOf(string $event, StateMethod $method): string
    {
        $listener = $method->stateClass.'@'.$method->name;
        $listenerDomain = $this->ownership->stateDomain($method->stateClass, $listener, $event);
        $declaring = $this->ownership->stateDomain($method->declaringClass, $listener, $event);

        if ($declaring !== $listenerDomain) {
            $this->ownership->assertOwnership($event, $listener, $method->name, $declaring);
        }

        $file = $this->reflectors->make($method->stateClass)->method($method->name)->fileName();
        $source = $this->ownership->stateSource($file, $listener, $event);

        if ($source !== $listenerDomain && $source !== $declaring) {
            $this->ownership->assertOwnership($event, $listener, $method->name, $source);
        }

        $this->ownership->assertOwnership($event, $listener, $method->name, $listenerDomain);

        return $listenerDomain->name ?? ListenerOwnership::CORE;
    }
}
