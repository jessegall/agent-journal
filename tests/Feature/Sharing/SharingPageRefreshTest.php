<?php

declare(strict_types=1);

namespace Tests\Feature\Sharing;

use App\Commands\ClaimGatewayOperation\ClaimGatewayOperationCommand;
use App\Commands\RecordGatewayOutcome\RecordGatewayOutcomeCommand;
use App\Enums\GatewayOperationType;
use App\Enums\GatewayOutcome;
use App\Events\PageChanged;
use App\Events\ShareActivated;
use App\Events\ShareCreated;
use App\Events\ShareExpired;
use App\Events\ShareFailed;
use App\Events\ShareGatewayChanged;
use App\Events\ShareRequested;
use App\Events\ShareRevoked;
use App\Events\ShareScopeChanged;
use App\Listeners\BroadcastPageChange;
use App\Models\Sharing\Share;
use App\Models\Sharing\ShareGatewayConfiguration;
use App\Models\Sharing\ShareGatewayOperation;
use App\Providers\DomainEventServiceProvider;
use App\Support\ClaimedGatewayOperation;
use Domain\Access\Support\AccessSettings;
use Illuminate\Support\Facades\Event;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\Sharing\FakeShareGateway;
use Tests\Support\Sharing\TestShares;
use Tests\Support\TestActors;
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
    use RunsTrustedCommands;

    private const array TABLES = [
        'command_receipts',
        'share_audits',
        'share_members',
        'share_gateway_operations',
        'shares',
        'share_gateway_endpoints',
        'share_gateway_configurations',
        'share_installations',
        'number_groups',
    ];

    private const string RUN = '01JD8X0G9M3QZ6V4K2RUN0000A';

    public function test_every_owner_facing_sharing_event_rereads_the_owners_pages(): void
    {
        $map = new DomainEventServiceProvider($this->app)->discoverEvents();

        foreach ([
            ShareCreated::class,
            ShareActivated::class,
            ShareFailed::class,
            ShareScopeChanged::class,
            ShareRevoked::class,
            ShareExpired::class,
            ShareGatewayChanged::class,
        ] as $event) {
            $this->assertContains(
                BroadcastPageChange::class.'@handle',
                $map[$event] ?? [],
                $event,
            );
        }

        $this->assertNotContains(BroadcastPageChange::class.'@handle', $map[ShareRequested::class] ?? []);
    }

    public function test_activating_a_share_sends_the_owner_a_page_change_with_nothing_in_it(): void
    {
        $this->app->instance(AccessSettings::class, TestActors::accessSettings(9));
        $configuration = ShareGatewayConfiguration::create(FakeShareGateway::settings());
        TestShares::grantForADay(TestActors::record('binders.binder', 1), $configuration);
        ShareGatewayOperation::create($configuration, GatewayOperationType::Open);
        $claim = $this->asSystem(new ClaimGatewayOperationCommand(self::RUN));
        $this->assertInstanceOf(ClaimedGatewayOperation::class, $claim);
        Event::fake([PageChanged::class]);

        $this->asSystem(
            new RecordGatewayOutcomeCommand(
                self::RUN,
                $claim->operation->operationId,
                $claim->operation->endpointVersion,
                $claim->operation->leaseToken,
                GatewayOutcome::Succeeded,
            ),
        );

        Event::assertDispatched(
            PageChanged::class,
            fn (PageChanged $change) => $change->userIds === [TestIds::of(9)] && $change->broadcastWith() === [],
        );
    }
}
