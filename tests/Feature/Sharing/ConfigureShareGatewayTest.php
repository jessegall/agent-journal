<?php

declare(strict_types=1);

namespace Tests\Feature\Sharing;

use App\Bus\Contracts\CommandBus;
use App\Bus\Models\CommandReceipt;
use App\Bus\Support\RequestKey;
use App\Sharing\Commands\ConfigureShareGateway;
use App\Sharing\Enums\ShareAuditType;
use App\Sharing\Exceptions\GatewayNotReady;
use App\Sharing\Exceptions\GatewaySecretRefused;
use App\Sharing\Exceptions\UnknownShareGateway;
use App\Sharing\Models\ShareAudit;
use App\Sharing\Models\ShareGatewayConfiguration;
use App\Sharing\Support\GatewayConfiguration;
use App\Sharing\Support\ShareGatewayRegistry;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Illuminate\Log\Events\MessageLogged;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\Sharing\FakeShareGateway;
use Tests\Support\Sharing\TestShares;
use Tests\Support\Sharing\UnreadyShareGateway;
use Tests\Support\StartsAgentRequests;
use Tests\Support\TestActors;
use Tests\TestCase;

/**
 * The owner configures a gateway as numbered settings revisions: a second revision leaves earlier shares on the first,
 * an unregistered gateway or a missing secret is refused, a gateway becomes the default only once it is ready, and
 * secrets are entered at a hidden prompt so their bytes appear in no row, receipt or log.
 */
final class ConfigureShareGatewayTest extends TestCase
{
    use RefreshHookDatabase;
    use StartsAgentRequests;

    private const string SECRET = 'hunter2-very-secret-bytes';

    private string $secretsFolder;

    protected function setUp(): void
    {
        parent::setUp();

        $this->secretsFolder = sys_get_temp_dir().'/sharing-secrets-'.Str::lower((string) Str::ulid());
        config(['sharing.secrets_dir' => $this->secretsFolder]);
        $this->app->make(ShareGatewayRegistry::class)->register(FakeShareGateway::KEY, FakeShareGateway::class);
        $this->app->make(ShareGatewayRegistry::class)->register(UnreadyShareGateway::KEY, UnreadyShareGateway::class);
        $this->app->instance(AccessSettings::class, TestActors::accessSettings(9));
    }

    protected function tearDown(): void
    {
        array_map(unlink(...), glob("{$this->secretsFolder}/*") ?: []);

        if (is_dir($this->secretsFolder)) {
            rmdir($this->secretsFolder);
        }

        parent::tearDown();
    }

    public function test_configuring_twice_makes_versions_one_and_two_and_a_share_keeps_the_first(): void
    {
        $first = $this->configure(FakeShareGateway::KEY, false);
        $share = TestShares::grantForADay(
            TestActors::record('binders.binder', 1),
            ShareGatewayConfiguration::query()->findOrFail($first->configurationId),
        );
        $second = $this->configure(FakeShareGateway::KEY, true);

        $this->assertSame([1, 2], [$first->configurationVersion, $second->configurationVersion]);
        $this->assertSame(
            [$first->configurationId, 1],
            [$share->fresh()?->share_gateway_configuration_id, $share->fresh()?->configuration_version],
        );
        $this->assertTrue(ShareGatewayConfiguration::query()->findOrFail($second->configurationId)->is_default);
        $this->assertSame(2, ShareAudit::query()->where('type', ShareAuditType::GatewayChanged->value)->count());
    }

    public function test_an_unregistered_gateway_and_a_missing_secret_are_refused(): void
    {
        $this->assertThrows(fn () => $this->configure('nowhere', false), UnknownShareGateway::class);
        $this->assertThrows(
            fn () => $this->configure(FakeShareGateway::KEY, false, ['not-stored']),
            GatewaySecretRefused::class,
        );
        $this->assertSame(0, ShareGatewayConfiguration::query()->count());
    }

    public function test_a_gateway_that_is_not_ready_cannot_be_made_the_default(): void
    {
        $this->assertThrows(
            fn () => $this->configure(UnreadyShareGateway::KEY, true),
            GatewayNotReady::class,
            'not logged in',
        );
        $this->assertSame(0, ShareGatewayConfiguration::query()->where('is_default', true)->count());

        $configured = $this->configure(UnreadyShareGateway::KEY, false);
        $this->assertFalse(ShareGatewayConfiguration::query()->findOrFail($configured->configurationId)->is_default);
    }

    public function test_a_secret_entered_at_the_prompt_appears_in_no_row_receipt_or_log(): void
    {
        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $logged = [];
        Event::listen(MessageLogged::class, function (MessageLogged $message) use (&$logged): void {
            $logged[] = $message->message.json_encode($message->context);
        });

        $this->artisan(
            'share:gateway',
            [
                'gateway' => FakeShareGateway::KEY,
                '--program-version' => '1.0.0',
                '--host' => 'fake.test',
                '--origin' => FakeShareGateway::PUBLIC_ORIGIN,
                '--secret' => ['fake-login'],
            ],
        )
            ->expectsQuestion('Enter the secret fake-login', self::SECRET)
            ->expectsOutputToContain('is at version 1')
            ->assertExitCode(0);

        $this->assertSame(self::SECRET, file_get_contents("{$this->secretsFolder}/fake-login"));
        $this->assertSame(['fake-login'], ShareGatewayConfiguration::query()->sole()->settings->secretReferences);
        $this->assertStringNotContainsString(
            self::SECRET,
            (string) json_encode(ShareGatewayConfiguration::query()->sole()->getAttributes()),
        );
        $this->assertStringNotContainsString(
            self::SECRET,
            (string) json_encode(CommandReceipt::query()->withoutGlobalScopes()->get()->map->getAttributes()->all()),
        );
        $this->assertStringNotContainsString(self::SECRET, implode("\n", $logged));
    }

    /**
     * @param  list<string>  $secretReferences
     */
    private function configure(
        string $gatewayKey,
        bool $makeDefault,
        array $secretReferences = [],
    ): GatewayConfiguration {
        $key = (string) Str::ulid();
        $this->app->forgetScopedInstances();
        $this->startTestUserRequest(9);
        $this->app->make(RequestKey::class)->set($key);

        return $this->app->make(CommandBus::class)->run(
            new ConfigureShareGateway(
                $gatewayKey,
                '1.0.0',
                'fake.test',
                FakeShareGateway::PUBLIC_ORIGIN,
                8100,
                $secretReferences,
                $makeDefault,
                $key,
            ),
        );
    }
}
