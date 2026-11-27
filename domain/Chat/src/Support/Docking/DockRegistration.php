<?php

declare(strict_types=1);

namespace Domain\Chat\Support\Docking;

use App\Reflection\Contracts\ReflectorFactory;
use App\Support\Registry;
use Domain\Chat\Contracts\Docking\Dockable;
use Domain\Chat\Contracts\Docking\DockableProvider;
use Domain\Chat\Contracts\Docking\DockRegistration as DockRegistrationContract;
use Domain\Chat\Contracts\Docking\FallbackDocks;
use Domain\Chat\Exceptions\DockDefinitionInvalid;
use Domain\Chat\Values\DockDefinition;
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

        $owned = $this->owned->find($type);

        if ($owned->isDefined()) {
            throw DockDefinitionInvalid::repeated($type, $owned->get()->class, $class);
        }

        $definition = new DockDefinition($type, $class, $provider);
        $this->owned->put($type, $definition);

        return $definition;
    }

    public function definition(string $type): DockDefinition
    {
        return $this->owned->find($type)->getOrCall(fn () => $this->fallbacks->definition($type));
    }

    public function offersDock(string $type): bool
    {
        return $this->owned->has($type) || $this->fallbacks->covers($type);
    }
}
