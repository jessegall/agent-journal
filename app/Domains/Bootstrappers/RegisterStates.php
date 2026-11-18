<?php

declare(strict_types=1);

namespace App\Domains\Bootstrappers;

use App\Domains\Contracts\DomainBootstrapper;
use App\Domains\Support\DomainEntry;
use App\Hooks\Events\StateTypesRequested;
use Illuminate\Contracts\Container\Container;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Hands the domain's agent states to the state registry whenever it is built.
 */
final readonly class RegisterStates implements DomainBootstrapper
{
    public function __construct(private Dispatcher $events, private Container $container) {}

    public function __invoke(DomainEntry $domain): void
    {
        $this->events->listen(StateTypesRequested::class, function (StateTypesRequested $event) use ($domain): void {
            foreach ($domain->states() as $typeKey => $factory) {
                $event->registry->register($typeKey, $this->container->make($factory));
            }
        });
    }
}
