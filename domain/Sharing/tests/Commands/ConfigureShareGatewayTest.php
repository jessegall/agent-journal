<?php

declare(strict_types=1);

namespace Domain\Sharing\Tests\Commands;

use App\Contracts\Bus\CommandBus;
use App\Models\CommandRules\CommandReceipt;
use App\Support\GatewayConfiguration;
use App\Support\RecordIdentity;
use App\Support\RequestKey;
use Domain\Sharing\Commands\ConfigureShareGateway\ConfigureShareGatewayCommand;
use Domain\Sharing\Enums\ShareAuditType;
use Domain\Sharing\Exceptions\GatewayNotSetUp;
use Domain\Sharing\Exceptions\GatewaySecretRefused;
use Domain\Sharing\Exceptions\UnknownShareGateway;
use Domain\Sharing\Models\Share;
use Domain\Sharing\Models\ShareAudit;
use Domain\Sharing\Models\ShareGatewayConfiguration;
use Domain\Sharing\Support\ShareGatewayRegistry;
use Domain\Sharing\Tests\Fixtures\ShareFixtures;
use Domain\Sharing\Tests\Support\FakeShareGateway;
use Domain\Sharing\Tests\Support\UnconfiguredShareGateway;
use Domain\Sharing\Tests\Support\UsesSecretsFolder;
use Domain\Sharing\Tests\TestCase;
use Illuminate\Log\Events\MessageLogged;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestActors;

/**
 * The owner configures a gateway as numbered settings revisions: a second revision leaves earlier shares on the first,
 * an unregistered gateway or a missing secret is refused, a gateway becomes the default only once it is ready, and
 * secrets are entered at a hidden prompt so their bytes appear in no row, receipt or log.
 */
#[TestsCommand(ConfigureShareGatewayCommand::class)]
final class ConfigureShareGatewayTest extends TestCase
{
    use RefreshHookDatabase;
    use UsesSecretsFolder;

    private const string NOT_LOGGED_IN = 'not logged in';

    private const string SECRET = 'hunter2-very-secret-bytes';

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->make(ShareGatewayRegistry::class)->register(FakeShareGateway::KEY, FakeShareGateway::class);
        $gateways = $this->app->make(ShareGatewayRegistry::class);
        $gateways->register(UnconfiguredShareGateway::KEY, UnconfiguredShareGateway::class);
        $this->journal->owner();
    }

    public function test_configuring_twice_makes_versions_one_and_two_and_a_share_keeps_the_first(): void
    {
        $first = $this->configure(FakeShareGateway::KEY, false);

        $share = $this->grantForADay(
            TestActors::record('binders.binder', 1),
            ShareGatewayConfiguration::query()->findOrFail($first->configurationId),
        );

        $second = $this->configure(FakeShareGateway::KEY, true);

        $this->assertSame([
            1,
            2,
        ], [
            $first->configurationVersion,
            $second->configurationVersion,
        ]);

        $this->assertSame(
            [
                $first->configurationId,
                1,
            ],
            [
                $share->fresh()?->share_gateway_configuration_id,
                $share->fresh()?->configuration_version,
            ],
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
            fn () => $this->configure(UnconfiguredShareGateway::KEY, true),
            GatewayNotSetUp::class,
            self::NOT_LOGGED_IN,
        );

        $this->assertSame(0, ShareGatewayConfiguration::query()->where('is_default', true)->count());

        $configured = $this->configure(UnconfiguredShareGateway::KEY, false);
        $this->assertFalse(ShareGatewayConfiguration::query()->findOrFail($configured->configurationId)->is_default);
    }

    public function test_a_secret_entered_at_the_prompt_appears_in_no_row_receipt_or_log(): void
    {
        $owner = $this->journal->ownerUser();
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
        bool $shouldMakeDefault,
        array $secretReferences = [],
    ): GatewayConfiguration {
        $key = (string) Str::ulid();
        $this->app->forgetScopedInstances();
        $this->journal->actAsUserId($this->journal->ownerUser()->id);
        $this->app->make(RequestKey::class)->set($key);

        return $this->app->make(CommandBus::class)->run(
            new ConfigureShareGatewayCommand(
                $gatewayKey,
                '1.0.0',
                'fake.test',
                FakeShareGateway::PUBLIC_ORIGIN,
                8100,
                $secretReferences,
                $shouldMakeDefault,
                $key,
            ),
        );
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
