<?php

declare(strict_types=1);

namespace App\Docking;

use App\Docking\Exceptions\DockDefinitionInvalid;
use App\Docking\Sources\Contracts\DockableProvider;
use App\Docking\Sources\Contracts\DockRegistration as DockRegistrationContract;
use App\Docking\Sources\Contracts\FallbackDocks;
use App\Reflection\Contracts\ReflectorFactory;
use App\Support\Registry;
use App\Support\Sources\Contracts\Dockable;
use App\Support\Sources\DockDefinition;
use Illuminate\Container\Attributes\Singleton;

/**
 * Every dockable type: the owners' own registrations, and for every other record type its fallback definition, read
 * when asked so an owner's registration wins in whichever order the two were made.
 */
#[Singleton]
final class DockRegistration implements DockRegistrationContract
{
    /**
     * @var Registry<DockDefinition>
     */
    private readonly Registry $owned;

    /**
     * @var array<string, true>
     */
    private array $offered = [];

    public function __construct(
        private readonly FallbackDocks $fallbacks,
        private readonly ReflectorFactory $reflectors,
    ) {
        $this->owned = Registry::replacing(DockDefinitionInvalid::unknown(...));
    }

    public function register(string $type, string $class, string $provider): DockDefinition
    {
        if (! $this->reflectors->isSubclassOf($class, Dockable::class)) {
            throw DockDefinitionInvalid::notDockable($type, $class);
        }

        if (! $this->reflectors->isSubclassOf($provider, DockableProvider::class)) {
            throw DockDefinitionInvalid::notAProvider($type, $provider);
        }

        if ($this->owned->has($type)) {
            throw DockDefinitionInvalid::repeated($type, $this->owned->get($type)->class, $class);
        }

        $definition = new DockDefinition($type, $class, $provider);
        $this->owned->put($type, $definition);

        return $definition;
    }

    public function offerDockFor(DockDefinition $definition): void
    {
        $this->offered[$definition->type] = true;
    }

    public function definition(string $type): DockDefinition
    {
        if ($this->owned->has($type)) {
            return $this->owned->get($type);
        }

        return $this->fallbacks->definition($type);
    }

    public function offersDock(string $type): bool
    {
        return isset($this->offered[$type])
            || (! $this->owned->has($type) && $this->fallbacks->covers($type));
    }
}
