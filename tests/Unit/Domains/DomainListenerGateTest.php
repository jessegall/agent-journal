<?php

declare(strict_types=1);

namespace Tests\Unit\Domains;

use App\Bootstrap\Contracts\Domains\DomainAvailability;
use App\Bus\AvailableListener;
use App\Bus\ListenerRegistry;
use App\Engine\Enums\ListenerLane;
use App\Providers\DomainEventServiceProvider;
use Domain\Memory\Listeners\SupplyMemories;
use Domain\Memory\MemoryDomain;
use Domain\Tasks\TasksDomain;
use stdClass;
use Tests\Fixtures\Listeners\CountingListener;
use Tests\Support\DomainBoot;
use Tests\Support\Settings\SwitchesDomainsOff;
use Tests\TestCase;

/**
 * A domain's listeners run only while the domain that owns them is available, asked when the event is delivered;
 * Core's listeners and registration closures always run, and the cached map gets the same gate as the discovered one.
 */
final class DomainListenerGateTest extends TestCase
{
    use SwitchesDomainsOff;

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(MemoryDomain::class, TasksDomain::class);
    }

    public function test_a_gated_listener_runs_only_while_its_domain_is_available_asked_at_delivery(): void
    {
        CountingListener::$received = 0;
        $available = new class implements DomainAvailability
        {
            public bool $plansOn = false;

            public function isEnabled(string $owner): bool
            {
                return $owner !== 'Plans' || $this->plansOn;
            }
        };
        $this->app->instance(DomainAvailability::class, $available);
        $gate = new AvailableListener('Plans', CountingListener::class);

        $gate(new stdClass());
        $this->assertSame(0, CountingListener::$received);

        $available->plansOn = true;
        $gate(new stdClass());
        $this->assertSame(1, CountingListener::$received);
    }

    public function test_domain_listeners_are_gated_by_their_own_domain_and_the_map_keeps_every_declaration(): void
    {
        $provider = new DomainEventServiceProvider($this->app);
        $discovered = $provider->discoverEvents();
        unset($discovered[DomainEventServiceProvider::LANES], $discovered[DomainEventServiceProvider::STATE_EVENTS]);
        $gated = $provider->getEvents();
        $registry = $this->app->make(ListenerRegistry::class);
        $kept = [];

        foreach (array_keys($discovered) as $event) {
            $kept[$event] = count($gated[$event] ?? []) + count(
                $registry->listenersOf($event, ListenerLane::InCommandTransaction),
            );
        }

        $this->assertSame(array_map('count', $discovered), $kept);

        $owners = [];
        $coreListeners = [];

        foreach ($gated as $listeners) {
            foreach ($listeners as $listener) {
                if ($listener instanceof AvailableListener) {
                    $owners[explode('@', $listener->listener)[0]] = $listener->owner;
                } elseif (is_string($listener)) {
                    $coreListeners[] = explode('@', $listener)[0];
                }
            }
        }

        $this->assertSame('Memory', $owners[SupplyMemories::class]);
        $this->assertNotEmpty(array_filter($coreListeners, fn (string $class) => str_starts_with($class, 'App\\')));
        $this->assertSame([], array_filter($coreListeners, fn (string $class) => str_starts_with($class, 'Domain\\')));
    }
}
