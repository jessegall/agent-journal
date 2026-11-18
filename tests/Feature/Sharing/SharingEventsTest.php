<?php

declare(strict_types=1);

namespace Tests\Feature\Sharing;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Support\SystemActor;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\CommandBus;
use App\Bus\Support\RequestKey;
use App\Records\Support\RecordIdentity;
use App\Sharing\Commands\ClaimGatewayOperation;
use App\Sharing\Commands\RecordGatewayOutcome;
use App\Sharing\Commands\RevokeShare;
use App\Sharing\Enums\GatewayOperationType;
use App\Sharing\Enums\GatewayOutcome;
use App\Sharing\Enums\ShareState;
use App\Sharing\Events\ShareActivated;
use App\Sharing\Events\ShareRevoked;
use App\Sharing\Models\Share;
use App\Sharing\Models\ShareGatewayConfiguration;
use App\Sharing\Models\ShareGatewayOperation;
use App\Sharing\Support\ClaimedGatewayOperation;
use App\Sharing\Support\ShareToken;
use Carbon\CarbonImmutable;
use Domain\Access\Support\AccessSettings;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;
use RuntimeException;
use Tests\Support\CommitsHookRows;
use Tests\Support\Sharing\FakeShareGateway;
use Tests\Support\TestIds;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Sharing's lifecycle events reach a listener only after the transition committed, carry the share's id, gateway
 * configuration, state and scope version and nothing secret, and a replayed or rolled-back transition raises none.
 */
#[TimeLimit(seconds: 5, reason: 'Its commands commit for real, and it empties nine tables around each test.')]
final class SharingEventsTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['command_receipts', 'share_audits', 'share_members', 'share_gateway_operations', 'shares', 'share_gateway_endpoints', 'share_gateway_configurations', 'share_installations', 'number_groups'];

    private const string RUN = '01JD8X0G9M3QZ6V4K2RUN0000A';

    private ShareGatewayConfiguration $configuration;

    private Share $share;

    /**
     * @var list<object>
     */
    private array $heard = [];

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->instance(AccessSettings::class, new AccessSettings(TestIds::of(9)));
        $this->configuration = ShareGatewayConfiguration::configure(FakeShareGateway::settings());
        $this->share = Share::grant(new RecordIdentity('binders.binder', TestIds::of(1)), TestIds::of(9), $this->configuration, ShareToken::generate(), CarbonImmutable::now()->addDay());
        ShareGatewayOperation::request($this->configuration, GatewayOperationType::Open);
        Event::listen([ShareActivated::class, ShareRevoked::class], function (object $event): void {
            $this->heard[] = $event;
        });
    }

    public function test_share_activated_reaches_a_listener_after_commit_once_and_not_on_a_replay(): void
    {
        $claim = $this->asSystem(new ClaimGatewayOperation(self::RUN));
        $this->assertInstanceOf(ClaimedGatewayOperation::class, $claim);
        $outcome = new RecordGatewayOutcome(self::RUN, $claim->operation->operationId, $claim->operation->endpointVersion, $claim->operation->leaseToken, GatewayOutcome::Succeeded);

        $this->asSystem($outcome);
        $this->asSystem($outcome);

        $this->assertCount(1, $this->heard);
        $this->assertInstanceOf(ShareActivated::class, $this->heard[0]);
        $this->assertSame([$this->share->id, $this->configuration->id, ShareState::Active, Share::FIRST_SCOPE_VERSION], [$this->heard[0]->share->shareId, $this->heard[0]->share->configurationId, $this->heard[0]->share->state, $this->heard[0]->share->scopeVersion]);
        $this->assertStringNotContainsString((string) $this->share->fresh()?->token_ciphertext, serialize($this->heard[0]));
    }

    public function test_a_rolled_back_revoke_raises_nothing_and_a_second_revoke_raises_nothing(): void
    {
        try {
            DB::transaction(function (): void {
                $this->asOwner(new RevokeShare($this->share->id, (string) Str::ulid()));
                $this->assertSame(ShareState::Revoked, $this->share->fresh()?->state);

                throw new RuntimeException('rolled back');
            });
        } catch (RuntimeException $failure) {
            $this->assertSame('rolled back', $failure->getMessage());
        }

        $this->assertSame([], $this->heard);
        $this->assertSame(ShareState::Pending, $this->share->fresh()?->state);

        $this->asOwner(new RevokeShare($this->share->id, (string) Str::ulid()));
        $this->asOwner(new RevokeShare($this->share->id, (string) Str::ulid()));

        $this->assertSame([ShareRevoked::class], array_map(fn (object $event) => $event::class, $this->heard));
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

    /**
     * @template TResult
     *
     * @param  Command<TResult>  $command
     * @return TResult
     */
    private function asOwner(Command $command): mixed
    {
        $this->app->forgetScopedInstances();
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser(TestIds::of(9)));
        $this->app->make(RequestKey::class)->set((string) Str::ulid());

        return $this->app->make(CommandBus::class)->run($command);
    }
}
