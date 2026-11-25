<?php

declare(strict_types=1);

namespace Domain\Sharing\Tests\Feature;

use Domain\Sharing\Commands\ClaimGatewayOperation\ClaimGatewayOperationCommand;
use Domain\Sharing\Commands\ConfigureShareGateway\ConfigureShareGatewayCommand;
use Domain\Sharing\Commands\CreateShare\CreateShareCommand;
use Domain\Sharing\Commands\DisableShareGateway\DisableShareGatewayCommand;
use Domain\Sharing\Commands\SaveSharePreview\SaveSharePreviewCommand;
use App\Contracts\Bus\Command;
use App\Contracts\Bus\CommandBus;
use Domain\Sharing\Enums\GatewayEndpointState;
use Domain\Sharing\Enums\GatewayOperationType;
use Domain\Sharing\Enums\ShareAuditType;
use Domain\Sharing\Enums\ShareState;
use Domain\Sharing\Exceptions\ShareGatewayUnavailable;
use Domain\Sharing\Models\Share;
use Domain\Sharing\Models\ShareAudit;
use Domain\Sharing\Models\ShareGatewayConfiguration;
use Domain\Sharing\Models\ShareGatewayEndpoint;
use Domain\Sharing\Models\ShareGatewayOperation;
use App\Support\Access\AccessSettings;
use App\Support\GatewayConfiguration;
use App\Support\RecordIdentity;
use App\Support\RequestKey;
use Domain\Sharing\Support\SavedSharePreview;
use Domain\Sharing\Support\ShareDuration;
use Domain\Sharing\Support\ShareGatewayRegistry;
use App\Support\ShareRecordRegistry;
use Domain\Sharing\Support\ShareSummary;
use Illuminate\Support\Str;
use Tests\Fixtures\Domains\Binders\BinderPublications;
use Tests\Fixtures\Domains\Binders\BindersDomain;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\Sharing\FakeShareGateway;
use Tests\Support\Sharing\RegistersShareDomains;
use Tests\Support\Sharing\TestShares;
use Tests\Support\StartsAgentRequests;
use Tests\Support\TestActors;
use Domain\Sharing\Tests\TestCase;

/**
 * A preview without a named gateway pins the current default; switching the default leaves earlier shares on their
 * revision; disabling a gateway revokes every share it serves before it asks its endpoint to close, after which no
 * preview falls back to another gateway, and a closing endpoint version is never opened again.
 */
final class GatewayDefaultAndDisableTest extends TestCase
{
    use RefreshHookDatabase;
    use RegistersShareDomains;
    use RunsTrustedCommands;
    use StartsAgentRequests;

    private const string RUN = '01JD8X0G9M3QZ6V4K2RUN0000A';

    private RecordIdentity $root;

    protected function setUp(): void
    {
        parent::setUp();

        $this->registerShareDomain(BindersDomain::class);
        $this->app->make(ShareRecordRegistry::class)->checkRelations();
        $this->app->make(ShareGatewayRegistry::class)->register(FakeShareGateway::KEY, FakeShareGateway::class);
        $this->app->instance(AccessSettings::class, TestActors::accessSettings(9));
        $this->app->instance(BinderPublications::class, new BinderPublications());
        $this->root = TestActors::record('binders.binder', 1);
    }

    public function test_switching_the_default_leaves_earlier_shares_on_their_revision(): void
    {
        $first = $this->configure();
        $earlier = $this->createShare($this->preview());
        $second = $this->configure();
        $later = $this->createShare($this->preview());

        $this->assertSame(
            $first->configurationId,
            Share::query()->findOrFail($earlier->shareId)->share_gateway_configuration_id,
        );
        $this->assertSame(
            [$second->configurationId, 2],
            [
                Share::query()->findOrFail($later->shareId)->share_gateway_configuration_id,
                Share::query()->findOrFail($later->shareId)->configuration_version,
            ],
        );
        $this->assertSame(
            [$second->configurationId],
            ShareGatewayConfiguration::query()->where('is_default', true)->pluck('id')->all(),
        );
    }

    public function test_disabling_a_gateway_revokes_its_three_shares_before_one_close(): void
    {
        $configuration = ShareGatewayConfiguration::query()->findOrFail($this->configure()->configurationId);
        ShareGatewayEndpoint::create($configuration, 1, self::RUN)->moveTo(GatewayEndpointState::Open);

        foreach ([1, 2, 3] as $number) {
            $share = TestShares::grantForADay(TestActors::record('binders.binder', $number), $configuration);
            $share->activate();
        }

        $this->asOwner(new DisableShareGatewayCommand($configuration->id, (string) Str::ulid()));

        $this->assertSame(
            [ShareState::Revoked],
            array_values(
                array_unique(
                    Share::query()->readAll('three shares')->get()->map(fn (Share $share) => $share->state)->all(),
                    SORT_REGULAR,
                ),
            ),
        );
        $this->assertSame(3, ShareAudit::query()->where('type', ShareAuditType::Revoked->value)->count());
        $this->assertSame(
            [GatewayOperationType::Close],
            ShareGatewayOperation::query()->readAll('one close')->get()->map(
                fn (ShareGatewayOperation $operation) => $operation->type,
            )->all(),
        );
        $disabled = ShareGatewayConfiguration::query()->findOrFail($configuration->id);
        $this->assertNotNull($disabled->disabled_at);
        $this->assertFalse($disabled->is_default);
    }

    public function test_after_the_default_is_disabled_a_preview_without_a_gateway_is_refused(): void
    {
        $configuration = $this->configure();
        $this->asOwner(new DisableShareGatewayCommand($configuration->configurationId, (string) Str::ulid()));

        $noDefault = ShareGatewayUnavailable::noDefault()->getMessage();

        $this->assertThrows(fn () => $this->preview(), ShareGatewayUnavailable::class, $noDefault);
    }

    public function test_a_closing_endpoint_version_is_never_opened_again(): void
    {
        $configuration = ShareGatewayConfiguration::query()->findOrFail($this->configure()->configurationId);
        $share = TestShares::grantForADay($this->root, $configuration);
        ShareGatewayOperation::create($configuration, GatewayOperationType::Open);
        $this->asSystem(new ClaimGatewayOperationCommand(self::RUN));
        $share->activate();

        $this->asOwner(new DisableShareGatewayCommand($configuration->id, (string) Str::ulid()));
        $this->asSystem(new ClaimGatewayOperationCommand(self::RUN));
        $this->assertSame(GatewayEndpointState::Closing, ShareGatewayEndpoint::query()->sole()->state);

        $configuration->disabled_at = null;
        $configuration->save();
        TestShares::grantForADay(TestActors::record('binders.binder', 2), $configuration);
        ShareGatewayOperation::create($configuration, GatewayOperationType::Open);

        $this->assertSame(2, $this->asSystem(new ClaimGatewayOperationCommand(self::RUN))?->operation->endpointVersion);
    }

    private function configure(): GatewayConfiguration
    {
        $key = (string) Str::ulid();

        return $this->asOwner(
            new ConfigureShareGatewayCommand(
                FakeShareGateway::KEY,
                '1.0.0',
                'fake.test',
                FakeShareGateway::PUBLIC_ORIGIN,
                8100,
                [],
                true,
                $key,
            ),
            $key,
        );
    }

    private function preview(): SavedSharePreview
    {
        return $this->asOwner(new SaveSharePreviewCommand($this->root->type, $this->root->id, []));
    }

    private function createShare(SavedSharePreview $saved): ShareSummary
    {
        $key = (string) Str::ulid();

        return $this->asOwner(
            new CreateShareCommand($saved->previewId, $saved->checksum, ShareDuration::STANDARD_MINUTES, $key),
            $key,
        );
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
        $this->startTestUserRequest(9);
        $requestKey = $this->app->make(RequestKey::class);
        $requestKey->set($key ?? (string) Str::ulid());

        return $this->app->make(CommandBus::class)->run($command);
    }
}
