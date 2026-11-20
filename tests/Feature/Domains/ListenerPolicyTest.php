<?php

declare(strict_types=1);

namespace Tests\Feature\Domains;

use App\CoreApi;
use App\Domains\Exceptions\InvalidListener;
use App\Domains\Providers\DomainEventServiceProvider;
use App\Domains\Support\DomainRegistry;
use App\Domains\Support\ListenerPolicy;
use App\Ui\Contracts\UserInterfaceUpdater;
use App\Web\Listeners\BroadcastPageChange;
use Domain\Plans\Api\Events\PlanProgressChanged;
use Tests\Fixtures\Boundary\EventCalls\Plans\Listeners\QuietListener;
use Tests\Fixtures\Boundary\EventCalls\Plans\PlansDomain as EventCallsPlansDomain;
use Tests\Fixtures\Boundary\EventCalls\Tasks\Events\TaskClosed;
use Tests\Fixtures\Boundary\EventCalls\Tasks\TasksDomain as EventCallsTasksDomain;
use Tests\Fixtures\Boundary\Events\Chat\ChatDomain;
use Tests\Fixtures\Boundary\Events\Chat\Events\MessageSent;
use Tests\Fixtures\Boundary\Events\Plans\Listeners\HearsMessage;
use Tests\Fixtures\Boundary\Events\Plans\PlansDomain;
use Tests\Fixtures\Boundary\Events\Tasks\TasksDomain;
use Tests\TestCase;

/**
 * Only the listener pairs a domain may see are registered: its own events, the exported events of the domains it
 * requires and Core's exported events.
 */
final class ListenerPolicyTest extends TestCase
{
    public function test_the_applications_own_listener_map_passes(): void
    {
        $provider = new DomainEventServiceProvider($this->app);

        $this->assertNotSame([], $provider->discoverEvents());
    }

    public function test_a_listener_on_an_event_its_owner_does_not_export_is_refused(): void
    {
        $policy = $this->policyFor([EventCallsTasksDomain::class, EventCallsPlansDomain::class]);

        $this->expectExceptionObject(
            InvalidListener::privateEvent(QuietListener::class.'@handle', 'handle', TaskClosed::class, 'Tasks'),
        );

        $policy->check([TaskClosed::class => [QuietListener::class.'@handle']]);
    }

    public function test_a_listener_on_an_event_of_a_domain_it_does_not_require_is_refused(): void
    {
        $policy = $this->policyFor([TasksDomain::class, ChatDomain::class, PlansDomain::class]);

        $this->expectExceptionObject(
            InvalidListener::notRequired(HearsMessage::class.'@handle', MessageSent::class, 'Chat'),
        );

        $policy->check([MessageSent::class => [HearsMessage::class.'@handle']]);
    }

    public function test_a_listener_of_the_user_interface_marker_hears_each_exported_ui_event_instead(): void
    {
        $policy = new ListenerPolicy(
            $this->app->make(DomainRegistry::class),
            CoreApi::exports(),
            CoreApi::listenerFolders(),
        );

        $expanded = $policy->expand([UserInterfaceUpdater::class => [BroadcastPageChange::class.'@handle']]);

        $this->assertArrayNotHasKey(UserInterfaceUpdater::class, $expanded);
        $this->assertSame([BroadcastPageChange::class.'@handle'], $expanded[PlanProgressChanged::class]);
        $this->assertSame($expanded, $policy->check($expanded));
    }

    /**
     * @param  list<class-string>  $domainClasses
     */
    private function policyFor(array $domainClasses): ListenerPolicy
    {
        return new ListenerPolicy(DomainRegistry::from($domainClasses), CoreApi::exports(), CoreApi::listenerFolders());
    }
}
