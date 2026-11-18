<?php

declare(strict_types=1);

namespace Tests\Feature\Sharing;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Support\SystemActor;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\CommandBus;
use App\Domains\Providers\DomainEventServiceProvider;
use App\Records\Support\RecordIdentity;
use App\Sharing\Commands\ClaimGatewayOperation;
use App\Sharing\Commands\RecordGatewayOutcome;
use App\Sharing\Enums\GatewayOperationType;
use App\Sharing\Enums\GatewayOutcome;
use App\Sharing\Events\ShareActivated;
use App\Sharing\Events\ShareCreated;
use App\Sharing\Events\ShareExpired;
use App\Sharing\Events\ShareFailed;
use App\Sharing\Events\ShareGatewayChanged;
use App\Sharing\Events\ShareRequested;
use App\Sharing\Events\ShareRevoked;
use App\Sharing\Events\ShareScopeChanged;
use App\Sharing\Models\Share;
use App\Sharing\Models\ShareGatewayConfiguration;
use App\Sharing\Models\ShareGatewayOperation;
use App\Sharing\Support\ClaimedGatewayOperation;
use App\Sharing\Support\ShareToken;
use App\Web\Events\PageChanged;
use App\Web\Listeners\BroadcastPageChange;
use Carbon\CarbonImmutable;
use Domain\Access\Support\AccessSettings;
use Illuminate\Support\Facades\Event;
use Tests\Support\CommitsHookRows;
use Tests\Support\Sharing\FakeShareGateway;
use Tests\Support\TestIds;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * The owner-facing sharing events tell the owner's open pages to reread: each is mapped to the page-change broadcast,
 * a share activated in one place sends the owner's channel a page change carrying nothing, and an agent's proposal
 * alone does not.
 */
#[TimeLimit(seconds: 5, reason: 'Its commands commit for real, and it empties nine tables around each test.')]
final class SharingPageRefreshTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['command_receipts', 'share_audits', 'share_members', 'share_gateway_operations', 'shares', 'share_gateway_endpoints', 'share_gateway_configurations', 'share_installations', 'number_groups'];

    private const string RUN = '01JD8X0G9M3QZ6V4K2RUN0000A';

    public function test_every_owner_facing_sharing_event_rereads_the_owners_pages(): void
    {
        $map = new DomainEventServiceProvider($this->app)->discoverEvents();

        foreach ([ShareCreated::class, ShareActivated::class, ShareFailed::class, ShareScopeChanged::class, ShareRevoked::class, ShareExpired::class, ShareGatewayChanged::class] as $event) {
            $this->assertContains(BroadcastPageChange::class.'@handle', $map[$event] ?? [], "{$event} does not reread the owner's pages.");
        }

        $this->assertNotContains(BroadcastPageChange::class.'@handle', $map[ShareRequested::class] ?? []);
    }

    public function test_activating_a_share_sends_the_owner_a_page_change_with_nothing_in_it(): void
    {
        $this->app->instance(AccessSettings::class, new AccessSettings(TestIds::of(9)));
        $configuration = ShareGatewayConfiguration::configure(FakeShareGateway::settings());
        Share::grant(new RecordIdentity('binders.binder', TestIds::of(1)), TestIds::of(9), $configuration, ShareToken::generate(), CarbonImmutable::now()->addDay());
        ShareGatewayOperation::request($configuration, GatewayOperationType::Open);
        $claim = $this->asSystem(new ClaimGatewayOperation(self::RUN));
        $this->assertInstanceOf(ClaimedGatewayOperation::class, $claim);
        Event::fake([PageChanged::class]);

        $this->asSystem(new RecordGatewayOutcome(self::RUN, $claim->operation->operationId, $claim->operation->endpointVersion, $claim->operation->leaseToken, GatewayOutcome::Succeeded));

        Event::assertDispatched(PageChanged::class, fn (PageChanged $change) => $change->userIds === [TestIds::of(9)] && $change->broadcastWith() === []);
    }

    /**
     * @template TResult
     *
     * @param  Command<TResult>  $command
     * @return TResult
     */
    private function asSystem(Command $command): mixed
    {
        $this->app->forgetScopedInstances();
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::of(new SystemActor()));

        return $this->app->make(CommandBus::class)->run($command);
    }
}
