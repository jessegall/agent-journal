<?php

declare(strict_types=1);

namespace Tests\Feature\Sharing;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Support\SystemActor;
use App\Actors\Values\TrustedEntryAuthority;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\CommandBus;
use App\Bus\Support\RequestKey;
use App\Records\Support\RecordIdentity;
use App\Sharing\Commands\ClaimGatewayOperation;
use App\Sharing\Commands\ConfigureShareGateway;
use App\Sharing\Commands\CreateShare;
use App\Sharing\Commands\DisableShareGateway;
use App\Sharing\Commands\SaveSharePreview;
use App\Sharing\Enums\GatewayEndpointState;
use App\Sharing\Enums\GatewayOperationType;
use App\Sharing\Enums\ShareAuditType;
use App\Sharing\Enums\ShareState;
use App\Sharing\Exceptions\ShareGatewayUnavailable;
use App\Sharing\Models\Share;
use App\Sharing\Models\ShareAudit;
use App\Sharing\Models\ShareGatewayConfiguration;
use App\Sharing\Models\ShareGatewayEndpoint;
use App\Sharing\Models\ShareGatewayOperation;
use App\Sharing\Support\GatewayConfiguration;
use App\Sharing\Support\SavedSharePreview;
use App\Sharing\Support\ShareDuration;
use App\Sharing\Support\ShareGatewayRegistry;
use App\Sharing\Support\ShareRecordRegistry;
use App\Sharing\Support\ShareSummary;
use App\Sharing\Support\ShareToken;
use Carbon\CarbonImmutable;
use Domain\Access\Support\AccessSettings;
use Illuminate\Support\Str;
use Tests\Fixtures\Domains\Binders\BinderPublications;
use Tests\Fixtures\Domains\Binders\BindersDomain;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\Sharing\FakeShareGateway;
use Tests\Support\Sharing\RegistersShareDomains;
use Tests\Support\StartsAgentRequests;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * A preview without a named gateway pins the current default; switching the default leaves earlier shares on their
 * revision; disabling a gateway revokes every share it serves before it asks its endpoint to close, after which no
 * preview falls back to another gateway, and a closing endpoint version is never opened again.
 */
final class GatewayDefaultAndDisableTest extends TestCase
{
    use RefreshHookDatabase, RegistersShareDomains;
    use StartsAgentRequests;

    private const string RUN = '01JD8X0G9M3QZ6V4K2RUN0000A';

    private RecordIdentity $root;

    protected function setUp(): void
    {
        parent::setUp();

        $this->registerShareDomain(BindersDomain::class);
        $this->app->make(ShareRecordRegistry::class)->checkRelations();
        $this->app->make(ShareGatewayRegistry::class)->register(FakeShareGateway::KEY, FakeShareGateway::class);
        $this->app->instance(AccessSettings::class, new AccessSettings(TestIds::of(9)));
        $this->app->instance(BinderPublications::class, new BinderPublications());
        $this->root = new RecordIdentity('binders.binder', TestIds::of(1));
    }

    public function test_switching_the_default_leaves_earlier_shares_on_their_revision(): void
    {
        $first = $this->configure();
        $earlier = $this->createShare($this->preview());
        $second = $this->configure();
        $later = $this->createShare($this->preview());

        $this->assertSame($first->configurationId, Share::query()->findOrFail($earlier->shareId)->share_gateway_configuration_id);
        $this->assertSame([$second->configurationId, 2], [Share::query()->findOrFail($later->shareId)->share_gateway_configuration_id, Share::query()->findOrFail($later->shareId)->configuration_version]);
        $this->assertSame([$second->configurationId], ShareGatewayConfiguration::query()->where('is_default', true)->pluck('id')->all());
    }

    public function test_disabling_a_gateway_revokes_its_three_shares_before_one_close(): void
    {
        $configuration = ShareGatewayConfiguration::query()->findOrFail($this->configure()->configurationId);
        ShareGatewayEndpoint::openFor($configuration, 1, self::RUN)->moveTo(GatewayEndpointState::Open);

        foreach ([1, 2, 3] as $number) {
            $share = Share::grant(new RecordIdentity('binders.binder', TestIds::of($number)), TestIds::of(9), $configuration, ShareToken::generate(), CarbonImmutable::now()->addDay());
            $share->activate();
        }

        $this->asOwner(new DisableShareGateway($configuration->id, (string) Str::ulid()));

        $this->assertSame([ShareState::Revoked], array_values(array_unique(Share::query()->readAll('three shares')->get()->map(fn (Share $share) => $share->state)->all(), SORT_REGULAR)));
        $this->assertSame(3, ShareAudit::query()->where('type', ShareAuditType::Revoked->value)->count());
        $this->assertSame([GatewayOperationType::Close], ShareGatewayOperation::query()->readAll('one close')->get()->map(fn (ShareGatewayOperation $operation) => $operation->type)->all());
        $disabled = ShareGatewayConfiguration::query()->findOrFail($configuration->id);
        $this->assertNotNull($disabled->disabled_at);
        $this->assertFalse($disabled->is_default);
    }

    public function test_after_the_default_is_disabled_a_preview_without_a_gateway_is_refused(): void
    {
        $configuration = $this->configure();
        $this->asOwner(new DisableShareGateway($configuration->configurationId, (string) Str::ulid()));

        $this->assertThrows(fn () => $this->preview(), ShareGatewayUnavailable::class, 'No default gateway');
    }

    public function test_a_closing_endpoint_version_is_never_opened_again(): void
    {
        $configuration = ShareGatewayConfiguration::query()->findOrFail($this->configure()->configurationId);
        $share = Share::grant($this->root, TestIds::of(9), $configuration, ShareToken::generate(), CarbonImmutable::now()->addDay());
        ShareGatewayOperation::request($configuration, GatewayOperationType::Open);
        $this->asSystem(new ClaimGatewayOperation(self::RUN));
        $share->activate();

        $this->asOwner(new DisableShareGateway($configuration->id, (string) Str::ulid()));
        $this->asSystem(new ClaimGatewayOperation(self::RUN));
        $this->assertSame(GatewayEndpointState::Closing, ShareGatewayEndpoint::query()->sole()->state);

        $configuration->disabled_at = null;
        $configuration->save();
        Share::grant(new RecordIdentity('binders.binder', TestIds::of(2)), TestIds::of(9), $configuration, ShareToken::generate(), CarbonImmutable::now()->addDay());
        ShareGatewayOperation::request($configuration, GatewayOperationType::Open);

        $this->assertSame(2, $this->asSystem(new ClaimGatewayOperation(self::RUN))?->operation->endpointVersion);
    }

    private function configure(): GatewayConfiguration
    {
        $key = (string) Str::ulid();

        return $this->asOwner(new ConfigureShareGateway(FakeShareGateway::KEY, '1.0.0', 'fake.test', FakeShareGateway::PUBLIC_ORIGIN, 8100, [], true, $key), $key);
    }

    private function preview(): SavedSharePreview
    {
        return $this->asOwner(new SaveSharePreview($this->root->type, $this->root->id, []));
    }

    private function createShare(SavedSharePreview $saved): ShareSummary
    {
        $key = (string) Str::ulid();

        return $this->asOwner(new CreateShare($saved->previewId, $saved->checksum, ShareDuration::STANDARD_MINUTES, $key), $key);
    }

    /**
     * @template TResult
     *
     * @param  Command<TResult>  $command
     * @return TResult
     */
    private function asOwner(Command $command, string|null $key = null): mixed
    {
        $this->app->forgetScopedInstances();
        $this->startUserRequestAs(TestIds::of(9));
        $requestKey = $this->app->make(RequestKey::class);
        $requestKey->set($key ?? (string) Str::ulid());

        return $this->app->make(CommandBus::class)->run($command);
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
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::of(new SystemActor()), new TrustedEntryAuthority('test'));

        return $this->app->make(CommandBus::class)->run($command);
    }
}
