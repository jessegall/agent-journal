<?php

declare(strict_types=1);

namespace Tests\Unit\Domains;

use App\Support\DomainRegistry;
use Illuminate\Contracts\Events\Dispatcher;
use Tests\TestCase;

/**
 * A core test boots no domain: the registry holds none, no domain's provider is registered, and no domain listens to
 * any event, so core is tested alone and a domain never answers core's events here.
 */
final class CoreBootsNoDomainTest extends TestCase
{
    public function test_the_registry_holds_no_domain(): void
    {
        $this->assertSame([], $this->app->make(DomainRegistry::class)->all());
    }

    public function test_no_domain_provider_is_registered(): void
    {
        $domainProviders = array_filter(
            array_keys($this->app->getLoadedProviders()),
            fn (string $provider) => str_starts_with($provider, 'Domain\\'),
        );

        $this->assertSame([], array_values($domainProviders));
    }

    public function test_no_domain_listens_to_an_event(): void
    {
        $listeners = $this->app->make(Dispatcher::class)->getRawListeners();
        $domainListeners = [];

        foreach ($listeners as $event => $eventListeners) {
            foreach (self::listedOf($eventListeners) as $listener) {
                $name = self::listenerClass($listener);

                if (str_starts_with($name, 'Domain\\')) {
                    $domainListeners[] = "{$event}: {$name}";
                }
            }
        }

        $this->assertSame([], $domainListeners);
    }

    /**
     * The listeners of one event, whether the dispatcher keeps a list of them or a single one.
     *
     * @return list<mixed>
     */
    private static function listedOf(mixed $eventListeners): array
    {
        if (is_array($eventListeners) && array_is_list($eventListeners)) {
            return $eventListeners;
        }

        return [$eventListeners];
    }

    /**
     * The class a raw listener names: a class string or the class of a class and method pair; empty for a closure.
     */
    private static function listenerClass(mixed $listener): string
    {
        if (is_string($listener)) {
            return $listener;
        }

        if (is_array($listener) && is_string($listener[0])) {
            return $listener[0];
        }

        return '';
    }
}
