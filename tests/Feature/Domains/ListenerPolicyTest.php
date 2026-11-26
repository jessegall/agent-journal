<?php

declare(strict_types=1);

namespace Tests\Feature\Domains;

use App\Contracts\Bus\PipelineRunner;
use App\Contracts\Navigation\ClientUpdate;
use App\Exceptions\InvalidListener;
use App\Listeners\BroadcastPageChange;
use App\Providers\DomainEventServiceProvider;
use App\Support\CatalogueReflectorFactory;
use App\Support\CoreListenerFolders;
use App\Support\DomainRegistry;
use App\Support\ListenerOwnership;
use App\Support\Registration\ListenerPolicy;
use Domain\Plans\Events\PlanProgressChanged;
use Domain\Plans\PlansDomain as InstalledPlansDomain;
use Tests\Fixtures\Boundary\EventCalls\Plans\Listeners\QuietListener;
use Tests\Fixtures\Boundary\EventCalls\Plans\PlansDomain as EventCallsPlansDomain;
use Tests\Fixtures\Boundary\EventCalls\Tasks\Events\TaskClosed;
use Tests\Fixtures\Boundary\EventCalls\Tasks\TasksDomain as EventCallsTasksDomain;
use Tests\Fixtures\Boundary\Events\Chat\ChatDomain;
use Tests\Fixtures\Boundary\Events\Chat\Events\MessageSent;
use Tests\Fixtures\Boundary\Events\Plans\Listeners\MessageListener;
use Tests\Fixtures\Boundary\Events\Plans\PlansDomain;
use Tests\Fixtures\Boundary\Events\Tasks\TasksDomain;
use Tests\Support\DomainBoot;
use Tests\TestCase;

/**
 * Only the listener pairs a domain may see are registered: its own events, the exported events of the domains it
 * requires and Core's exported events.
 */
final class ListenerPolicyTest extends TestCase
{
    /**
     * Plans, whose exported client events the test expands.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(InstalledPlansDomain::class);
    }

    public function test_the_applications_own_listener_map_passes(): void
    {
        $provider = new DomainEventServiceProvider($this->app);

        $this->assertNotSame([], $provider->discoverEvents());
    }

    public function test_a_listener_on_an_event_its_owner_does_not_export_is_refused(): void
    {
        $policy = $this->policyFor(DomainRegistry::from([EventCallsTasksDomain::class, EventCallsPlansDomain::class]));

        $this->expectExceptionObject(
            InvalidListener::privateEvent(QuietListener::class.'@handle', 'handle', TaskClosed::class, 'Tasks'),
        );

        $policy->discover([TaskClosed::class => [QuietListener::class.'@handle']]);
    }

    public function test_a_listener_on_an_event_of_a_domain_it_does_not_require_is_refused(): void
    {
        $policy = $this->policyFor(DomainRegistry::from([TasksDomain::class, ChatDomain::class, PlansDomain::class]));

        $this->expectExceptionObject(
            InvalidListener::notRequired(MessageListener::class.'@handle', MessageSent::class, 'Chat'),
        );

        $policy->discover([MessageSent::class => [MessageListener::class.'@handle']]);
    }

    public function test_a_listener_of_the_client_marker_receives_each_exported_client_event_instead(): void
    {
        $policy = $this->policyFor($this->app->make(DomainRegistry::class));
        $expanded = $policy->discover([ClientUpdate::class => [BroadcastPageChange::class.'@handle']]);

        $this->assertArrayNotHasKey(ClientUpdate::class, $expanded);
        $this->assertSame([BroadcastPageChange::class.'@handle'], $expanded[PlanProgressChanged::class]);
    }

    public function test_a_cached_listener_with_a_missing_method_is_refused(): void
    {
        $policy = $this->policyFor($this->app->make(DomainRegistry::class));
        $listener = BroadcastPageChange::class.'@missing';

        $this->expectExceptionObject(InvalidListener::staleCache($listener, PlanProgressChanged::class));

        $policy->registerCached([PlanProgressChanged::class => [$listener]]);
    }

    private function policyFor(DomainRegistry $registry): ListenerPolicy
    {
        return new ListenerPolicy(
            $this->app->make(PipelineRunner::class),
            new ListenerOwnership($registry, CoreListenerFolders::all(), new CatalogueReflectorFactory(), app_path()),
        );
    }
}
