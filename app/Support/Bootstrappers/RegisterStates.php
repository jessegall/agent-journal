<?php

declare(strict_types=1);

namespace App\Support\Bootstrappers;

use App\Contracts\Domains\DomainAvailability;
use App\Contracts\Domains\DomainBootstrapper;
use App\Events\Hooks\StateTypesRequested;
use App\Support\DomainEntry;
use App\Support\DomainRegistry;
use App\Support\StateLoading\RegisteredStateType;
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
        $availability = static fn (): DomainAvailability => ContainerInstance::getInstance()->make(
            DomainAvailability::class,
        );

        $this->events->listen(StateTypesRequested::class, function (
            StateTypesRequested $event,
        ) use ($domain, $availability): void {
            $switchable = $this->container->make(DomainRegistry::class)->has($domain->name);

            foreach ($domain->states() as $stateClass) {
                $type = RegisteredStateType::of($stateClass);

                $event->registry->register(
                    $switchable ? $type->switchedBy(fn (): bool => $availability()->isEnabled($domain->name)) : $type,
                );
            }
        });
    }
}
