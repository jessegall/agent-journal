<?php

declare(strict_types=1);

namespace Domain\Sharing\Tests\Commands;

use App\Bus\Contracts\Command;
use App\Bus\Contracts\CommandBus;
use App\Bus\RequestKey;
use App\Sharing\GatewayConfiguration;
use App\Sharing\ShareRecordRegistry;
use App\Support\RecordIdentity;
use Domain\Sharing\Commands\ClaimGatewayOperation\ClaimGatewayOperationCommand;
use Domain\Sharing\Commands\ConfigureShareGateway\ConfigureShareGatewayCommand;
use Domain\Sharing\Commands\DisableShareGateway\DisableShareGatewayCommand;
use Domain\Sharing\Commands\SaveSharePreview\SaveSharePreviewCommand;
use Domain\Sharing\Enums\GatewayEndpointStatus;
use Domain\Sharing\Enums\GatewayOperationType;
use Domain\Sharing\Enums\ShareAuditType;
use Domain\Sharing\Enums\ShareStatus;
use Domain\Sharing\Exceptions\ShareGatewayUnavailable;
use Domain\Sharing\Models\Share;
use Domain\Sharing\Models\ShareAudit;
use Domain\Sharing\Models\ShareGatewayConfiguration;
use Domain\Sharing\Models\ShareGatewayEndpoint;
use Domain\Sharing\Models\ShareGatewayOperation;
use Domain\Sharing\Support\SavedSharePreview;
use Domain\Sharing\Support\ShareGatewayRegistry;
use Domain\Sharing\Tests\Fixtures\ShareFixtures;
use Domain\Sharing\Tests\Support\FakeShareGateway;
use Domain\Sharing\Tests\Support\RegistersShareDomains;
use Domain\Sharing\Tests\TestCase;
use Illuminate\Support\Str;
use Tests\Fixtures\Domains\Binders\BinderPublications;
use Tests\Fixtures\Domains\Binders\BindersDomain;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestActors;

/**
 * Disabling a gateway revokes its shares before one close, a preview without a gateway is refused once the default
 * is disabled, and a closing endpoint version is never opened again.
 */
#[TestsCommand(DisableShareGatewayCommand::class)]
final class DisableShareGatewayTest extends TestCase
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
            $share = $this->grantForADay(TestActors::record('binders.binder', $number), $configuration);
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
        $share = $this->grantForADay($this->root, $configuration);
        ShareGatewayOperation::create($configuration, GatewayOperationType::Open);
        $this->journal->asSystem(new ClaimGatewayOperationCommand(self::RUN));
        $share->activate();

        $this->asOwner(new DisableShareGatewayCommand($configuration->id, (string) Str::ulid()));
        $this->journal->asSystem(new ClaimGatewayOperationCommand(self::RUN));
        $this->assertSame(GatewayEndpointStatus::Closing, ShareGatewayEndpoint::query()->sole()->status);

        $configuration->disabled_at = null;
        $configuration->save();
        $this->grantForADay(TestActors::record('binders.binder', 2), $configuration);
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

        return $this->journal->fixtures(ShareFixtures::class)->grantForADay(
            $name,
            $root,
            $configuration,
        )->shareCalled($name);
    }
}
