<?php

declare(strict_types=1);

namespace Tests\Commands\Sharing;

use App\Bus\Contracts\Command;
use App\Bus\Contracts\CommandBus;
use App\Bus\RequestKey;
use App\Models\Sharing\Share;
use App\Models\Sharing\ShareAudit;
use App\Models\Sharing\ShareGatewayConfiguration;
use App\Models\Sharing\ShareGatewayEndpoint;
use App\Models\Sharing\ShareGatewayOperation;
use App\Sharing\Commands\ClaimGatewayOperation\ClaimGatewayOperationCommand;
use App\Sharing\Commands\ConfigureShareGateway\ConfigureShareGatewayCommand;
use App\Sharing\Commands\DisableShareGateway\DisableShareGatewayCommand;
use App\Sharing\Commands\SaveSharePreview\SaveSharePreviewCommand;
use App\Sharing\Enums\GatewayEndpointStatus;
use App\Sharing\Enums\GatewayOperationType;
use App\Sharing\Enums\ShareAuditType;
use App\Sharing\Enums\ShareStatus;
use App\Sharing\Exceptions\ShareGatewayUnavailable;
use App\Sharing\Support\Gateways\GatewayConfiguration;
use App\Sharing\Support\SavedSharePreview;
use App\Sharing\Support\ShareGatewayRegistry;
use App\Sharing\Support\ShareRecordRegistry;
use App\Support\RecordIdentity;
use Illuminate\Support\Str;
use Tests\Fixtures\Domains\Binders\BinderPublications;
use Tests\Fixtures\Domains\Binders\BindersDomain;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\Sharing\FakeShareGateway;
use Tests\Support\Sharing\RegistersShareDomains;
use Tests\Support\Sharing\SharingTestCase;
use Tests\Support\TestActors;

/**
 * Disabling a gateway revokes its shares before one close, a preview without a gateway is refused once the default
 * is disabled, and a closing endpoint version is never opened again.
 */
#[TestsCommand(DisableShareGatewayCommand::class)]
final class DisableShareGatewayTest extends SharingTestCase
{
    use RefreshHookDatabase;
    use RegistersShareDomains;

    private const string RUN = '01JD8X0G9M3QZ6V4K2RUN0000A';

    private RecordIdentity $root;

    protected function setUp(): void
    {
        parent::setUp();

        $this->registerShareDomain(BindersDomain::class);
        $this->app->make(ShareRecordRegistry::class)->checkRelations();
        $this->app->make(ShareGatewayRegistry::class)->register(FakeShareGateway::KEY, FakeShareGateway::class);
        $this->journal->owner();
        $this->app->instance(BinderPublications::class, new BinderPublications());
        $this->root = TestActors::record('binders.binder', 1);
    }

    public function test_disabling_a_gateway_revokes_its_three_shares_before_one_close(): void
    {
        $configuration = ShareGatewayConfiguration::query()->findOrFail($this->configure()->configurationId);
        ShareGatewayEndpoint::create($configuration, 1, self::RUN)->moveTo(GatewayEndpointStatus::Open);

        foreach ([
            1,
            2,
            3,
        ] as $number) {
            $share = $this->shareForADay(TestActors::record('binders.binder', $number), $configuration);
            $share->activate();
        }

        $this->asOwner(new DisableShareGatewayCommand($configuration->id, (string) Str::ulid()));

        $this->assertSame(
            [ShareStatus::Revoked],
            array_values(
                array_unique(
                    Share::query()->readAll('three shares')->get()->map(fn (Share $share) => $share->status)->all(),
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
        $share = $this->shareForADay($this->root, $configuration);
        ShareGatewayOperation::create($configuration, GatewayOperationType::Open);
        $this->journal->asSystem(new ClaimGatewayOperationCommand(self::RUN));
        $share->activate();

        $this->asOwner(new DisableShareGatewayCommand($configuration->id, (string) Str::ulid()));
        $this->journal->asSystem(new ClaimGatewayOperationCommand(self::RUN));
        $this->assertSame(GatewayEndpointStatus::Closing, ShareGatewayEndpoint::query()->sole()->status);

        $configuration->disabled_at = null;
        $configuration->save();
        $this->shareForADay(TestActors::record('binders.binder', 2), $configuration);
        ShareGatewayOperation::create($configuration, GatewayOperationType::Open);

        $this->assertSame(
            2,
            $this->journal->asSystem(new ClaimGatewayOperationCommand(self::RUN))?->operation->endpointVersion,
        );
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

    /**
     * @template TResult
     *
     * @param  Command<TResult>  $command
     * @return TResult
     */
    private function asOwner(Command $command, string|null $key = null): mixed
    {
        $this->app->forgetScopedInstances();
        $this->journal->actAsUserId($this->journal->ownerUser()->id);
        $requestKey = $this->app->make(RequestKey::class);
        $requestKey->set($key ?? (string) Str::ulid());

        return $this->app->make(CommandBus::class)->run($command);
    }

    /**
     * A share the journal's owner granted on the root for a day, kept under the root's reference.
     */
    private function grantForADay(RecordIdentity $root, ShareGatewayConfiguration $configuration): Share
    {
        $name = $root->reference();

        return $this->journal->shareForADay(
            $name,
            $root,
            $configuration,
        )->shareCalled($name);
    }
}
