<?php

declare(strict_types=1);

namespace App\Domains\Bootstrappers;

use App\Contracts\DomainAvailability;
use App\CoreApi;
use App\Domains\Contracts\DomainBootstrapper;
use App\Domains\Exceptions\InvalidListener;
use App\Domains\Support\DomainEntry;
use App\Domains\Support\DomainRegistry;
use App\Domains\Support\DomainStateType;
use App\Domains\Support\DomainTickableStateType;
use App\Hooks\Contracts\StateLoader;
use App\Hooks\Contracts\TickableStateLoader;
use App\Hooks\Events\StateTypesRequested;
use Closure;
use Illuminate\Container\Container as ContainerInstance;
use Illuminate\Contracts\Container\Container;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Hands the domain's agent states to the state registry whenever it is built. A listed domain's states are wrapped with
 * the domain so they run only while it is available; a module installed outside the domain list has no switch, so its
 * states are registered as they are.
 */
final readonly class RegisterStates implements DomainBootstrapper
{
    public function __construct(private Dispatcher $events, private Container $container) {}

    public function __invoke(DomainEntry $domain): void
    {
        if (! CoreApi::exports()->hasEvent(StateTypesRequested::class)) {
            throw InvalidListener::privateEvent(self::class, '__invoke', StateTypesRequested::class, 'Core');
        }

        $availability = static fn (): DomainAvailability => ContainerInstance::getInstance()->make(DomainAvailability::class);

        $this->events->listen(StateTypesRequested::class, function (StateTypesRequested $event) use ($domain, $availability): void {
            $switchable = $this->container->make(DomainRegistry::class)->has($domain->name);

            foreach ($domain->states() as $typeKey => $factory) {
                $loader = $this->container->make($factory);
                $event->registry->register($typeKey, $switchable ? $this->domainStateType($domain, $loader, $availability) : $loader);
            }
        });
    }

    /**
     * The loader wrapped with its domain; a ticking loader keeps its mark, so the engine still finds its frames.
     *
     * @param  Closure(): DomainAvailability  $availability
     */
    private function domainStateType(DomainEntry $domain, StateLoader $loader, Closure $availability): StateLoader
    {
        $type = new DomainStateType($domain->name, $loader, $availability);

        return $loader instanceof TickableStateLoader ? new DomainTickableStateType($type, $loader) : $type;
    }
}
