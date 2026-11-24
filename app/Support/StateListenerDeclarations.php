<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Reflection\ReflectorFactory;
use App\Declarations\StateEventDeclaration;
use App\Declarations\StateEvents;
use App\Declarations\StateMethod;
use App\Declarations\StateMethods;
use App\Support\StateCatalog\StateTypeRegistry;

/**
 * Collects state listeners from the registered state types and checks the owners of their methods and source files.
 */
final readonly class StateListenerDeclarations
{
    public function __construct(private ListenerOwnership $ownership, private ReflectorFactory $reflectors) {}

    public function declarations(StateTypeRegistry $types, StateMethods $methods): StateEvents
    {
        $declarations = [];

        foreach ($types->types() as $type) {
            foreach ($methods->eventsOf($type->stateClass) as $heard => $method) {
                $events = ListenerOwnership::isGroup($heard) ? $this->ownership->eventsOf($heard) : [$heard];

                foreach ($events as $event) {
                    $declaration = new StateEventDeclaration($event, $method, $this->ownerOf($event, $method));
                    $declarations[$declaration->cacheEntry()] = $declaration;
                }
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
