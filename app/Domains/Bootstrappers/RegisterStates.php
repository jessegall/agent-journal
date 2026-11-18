<?php

declare(strict_types=1);

namespace App\Domains\Bootstrappers;

use App\Contracts\DomainAvailability;
use App\CoreApi;
use App\Domains\Contracts\DomainBootstrapper;
use App\Domains\Exceptions\InvalidListener;
use App\Domains\Support\DomainEntry;
use App\Domains\Support\DomainStateType;
use App\Hooks\Events\StateTypesRequested;
use Illuminate\Container\Container as ContainerInstance;
use Illuminate\Contracts\Container\Container;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Hands the domain's agent states to the state registry whenever it is built, each wrapped with the domain that owns it
 * so it runs only while that domain is available.
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
            foreach ($domain->states() as $typeKey => $factory) {
                $event->registry->register($typeKey, new DomainStateType($domain->name, $this->container->make($factory), $availability));
            }
        });
    }
}
