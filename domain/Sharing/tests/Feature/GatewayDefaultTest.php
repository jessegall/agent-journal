<?php

declare(strict_types=1);

namespace Domain\Sharing\Tests\Feature;

use App\Contracts\Bus\Command;
use App\Contracts\Bus\CommandBus;
use App\Support\Access\AccessSettings;
use App\Support\GatewayConfiguration;
use App\Support\RecordIdentity;
use App\Support\RequestKey;
use App\Support\ShareRecordRegistry;
use Domain\Sharing\Commands\ConfigureShareGateway\ConfigureShareGatewayCommand;
use Domain\Sharing\Commands\CreateShare\CreateShareCommand;
use Domain\Sharing\Commands\SaveSharePreview\SaveSharePreviewCommand;
use Domain\Sharing\Models\Share;
use Domain\Sharing\Models\ShareGatewayConfiguration;
use Domain\Sharing\Support\SavedSharePreview;
use Domain\Sharing\Support\ShareDuration;
use Domain\Sharing\Support\ShareGatewayRegistry;
use Domain\Sharing\Support\ShareSummary;
use Domain\Sharing\Tests\TestCase;
use Illuminate\Support\Str;
use Tests\Fixtures\Domains\Binders\BinderPublications;
use Tests\Fixtures\Domains\Binders\BindersDomain;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\Sharing\FakeShareGateway;
use Tests\Support\Sharing\RegistersShareDomains;
use Tests\Support\StartsAgentRequests;
use Tests\Support\TestActors;

/**
 * Switching the default gateway leaves earlier shares on their revision.
 */
final class GatewayDefaultTest extends TestCase
{
    use RefreshHookDatabase;
    use RegistersShareDomains;
    use RunsTrustedCommands;
    use StartsAgentRequests;

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
            [
                $second->configurationId,
                2,
            ],
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
