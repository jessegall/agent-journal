<?php

declare(strict_types=1);

namespace Domain\Sharing\Tests\Feature;

use Domain\Sharing\Commands\ClaimGatewayOperation\ClaimGatewayOperationCommand;
use Domain\Sharing\Commands\RecordGatewayOutcome\RecordGatewayOutcomeCommand;
use Domain\Sharing\Enums\GatewayOperationType;
use Domain\Sharing\Enums\GatewayOutcome;
use Domain\Sharing\Events\ShareActivated;
use Domain\Sharing\Events\ShareCreated;
use Domain\Sharing\Events\ShareExpired;
use Domain\Sharing\Events\ShareFailed;
use Domain\Sharing\Events\ShareGatewayChanged;
use Domain\Sharing\Events\ShareRequested;
use Domain\Sharing\Events\ShareRevoked;
use Domain\Sharing\Events\ShareScopeChanged;
use App\Events\Web\PageChanged;
use App\Listeners\BroadcastPageChange;
use Domain\Sharing\Models\Share;
use Domain\Sharing\Models\ShareGatewayConfiguration;
use Domain\Sharing\Models\ShareGatewayOperation;
use App\Providers\DomainEventServiceProvider;
use App\Support\Access\AccessSettings;
use Domain\Sharing\Support\ClaimedGatewayOperation;
use Illuminate\Support\Facades\Event;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\Sharing\FakeShareGateway;
use Tests\Support\Sharing\TestShares;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\Support\TimeLimits\TimeLimit;
use Domain\Sharing\Tests\TestCase;

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
