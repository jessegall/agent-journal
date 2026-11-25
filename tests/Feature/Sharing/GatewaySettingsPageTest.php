<?php

declare(strict_types=1);

namespace Tests\Feature\Sharing;

use App\Enums\Sharing\ShareState;
use App\Models\Access\User;
use App\Models\Sharing\Share;
use App\Models\Sharing\ShareGatewayConfiguration;
use App\Support\Access\AccessSettings;
use App\Support\ShareGatewayRegistry;
use App\Support\ShareGrant;
use App\Support\ShareToken;
use Carbon\CarbonImmutable;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Inertia\Testing\AssertableInertia;
use Symfony\Component\HttpFoundation\Response;
use Tests\Support\CommitsHookRows;
use Tests\Support\Sharing\FakeShareGateway;
use Tests\Support\Sharing\UsesSecretsFolder;
use Tests\Support\TestActors;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * The owner's gateway settings page: it lists every registered gateway and revision with why it is not ready and
 * says Offline when no sharing service runs; the owner configures Tunler and ngrok with secrets typed into password
 * fields that are never shown again, makes a ready gateway the default, and disables one after seeing the shares it
 * revokes. Anyone else sees none of it.
 */
#[TimeLimit(
    seconds: 10,
    reason: 'It renders pages and commits gateway revisions, and empties eight tables around each test.',
)]
final class GatewaySettingsPageTest extends TestCase
{
    use CommitsHookRows;
    use UsesSecretsFolder;

    private const array TABLES = [
        'command_receipts',
        'share_audits',
        'share_members',
        'share_gateway_operations',
        'shares',
        'share_gateway_endpoints',
        'share_gateway_configurations',
        'share_installations',
        'users',
        'number_groups',
    ];

    private const string SECRET = 'tunler-login-secret-bytes';

    private User $owner;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        config(
            [
                'sharing.secrets_dir' => $this->secretsFolder,
                'sharing.tunler.binary' => '/nonexistent/tunler',
                'sharing.ngrok.binary' => '/nonexistent/ngrok',
            ],
        );
        $this->app->make(ShareGatewayRegistry::class)->register(FakeShareGateway::KEY, FakeShareGateway::class);
    }

    public function test_the_owner_configures_tunler_and_ngrok_and_sees_why_each_is_not_ready(): void
    {
        $this->configure(
            'tunler',
            'https://journal.tunler.test',
            [['name' => 'tunler-login', 'value' => self::SECRET]],
        )->assertStatus(303);
        $this->configure('ngrok', 'https://journal.ngrok.test', [])->assertStatus(303);

        $page = $this->actingAs($this->owner)->get('/sharing/gateways')->assertOk()->assertInertia(fn (
            AssertableInertia $page,
        ) => $page
            ->component('layout/DeclaredLayout')
            ->where('page.data.root.children.1.key', 'offline')
            ->has('page.data.root.children.3.children', 2)
            ->where(
                'page.data.root.children.3.children.0.children.0.children.0.text',
                fn (string $label) => str_starts_with($label, 'ngrok version'),
            )
            ->where(
                'page.data.root.children.3.children.1.children.0.children.0.text',
                fn (string $label) => str_starts_with($label, 'tunler version'),
            )
            ->where('page.data.root.children.3.children.1.children.2.text', 'Secrets: tunler-login')
            ->where(
                'page.data.root.children.3.children.1.children.3.rows.0.label',
                'The tunler program is not installed at its pinned path.',
            ));

        $this->assertContains(
            'tunler',
            $page->viewData('page')['props']['page']['data']['root']['children'][4]['native']['props']['gatewayKeys'],
        );
        $this->assertStringNotContainsString(self::SECRET, (string) $page->getContent());
        $this->assertStringNotContainsString(
            self::SECRET,
            (string) json_encode(
                ShareGatewayConfiguration::query()->readAll('two revisions')->get()->map->getAttributes()->all(),
            ),
        );
        $this->assertSame(self::SECRET, file_get_contents("{$this->secretsFolder}/tunler-login"));
    }

    public function test_the_owner_makes_a_ready_gateway_the_default(): void
    {
        $this->configure(FakeShareGateway::KEY, FakeShareGateway::PUBLIC_ORIGIN, [])->assertStatus(303);
        $first = ShareGatewayConfiguration::query()->sole();

        $this->write('post', "/sharing/gateways/{$first->id}/default")->assertStatus(303);

        $this->assertSame(
            [2],
            ShareGatewayConfiguration::query()->where('is_default', true)->pluck('configuration_version')->all(),
        );
    }

    public function test_the_owner_sees_the_shares_a_disable_revokes_and_then_disables(): void
    {
        $this->configure(FakeShareGateway::KEY, FakeShareGateway::PUBLIC_ORIGIN, [])->assertStatus(303);
        $configuration = ShareGatewayConfiguration::query()->sole();
        $share = Share::create(
            TestActors::record('binders.binder', 1),
            CarbonImmutable::now()->addDay(),
            new ShareGrant(
                $this->owner->id,
                $configuration->id,
                $configuration->configuration_version,
                ShareToken::generate(),
            ),
        );

        $this->actingAs($this->owner)->get('/sharing/gateways')->assertOk()->assertInertia(fn (
            AssertableInertia $page,
        ) => $page
            ->where('page.data.root.children.3.children.0.children.3.children.1.rows.0.key', $share->id));
        $this->write('delete', "/sharing/gateways/{$configuration->id}")->assertStatus(303);

        $this->assertSame(ShareState::Revoked, Share::query()->findOrFail($share->id)->state);
        $this->assertNotNull(ShareGatewayConfiguration::query()->sole()->disabled_at);
    }

    public function test_a_write_without_an_idempotency_key_and_another_user_are_refused(): void
    {
        $this->actingAs($this->owner)->postJson(
            '/sharing/gateways',
            $this->settings('ngrok', 'https://journal.ngrok.test', []),
        )->assertUnprocessable();
        $other = User::factory()->create();

        $this->assertFalse($this->actingAs($other)->get('/sharing/gateways')->isOk());
        $this->assertFalse(
            $this->actingAs($other)->post(
                '/sharing/gateways',
                $this->settings('ngrok', 'https://journal.ngrok.test', []),
                ['Idempotency-Key' => (string) Str::ulid()],
            )->isSuccessful(),
        );
        $this->assertSame(0, ShareGatewayConfiguration::query()->count());
    }

    /**
     * @param  list<array{name: string, value: string}>  $secrets
     * @return TestResponse<Response>
     */
    private function configure(string $gatewayKey, string $origin, array $secrets): TestResponse
    {
        return $this->actingAs($this->owner)->post(
            '/sharing/gateways',
            $this->settings($gatewayKey, $origin, $secrets),
            ['Idempotency-Key' => (string) Str::ulid()],
        );
    }

    /**
     * @param  list<array{name: string, value: string}>  $secrets
     * @return array<string, mixed>
     */
    private function settings(string $gatewayKey, string $origin, array $secrets): array
    {
        return [
            'gatewayKey' => $gatewayKey,
            'executableVersion' => '1.0.0',
            'providerHost' => 'provider.test',
            'publicOrigin' => $origin,
            'listenerPort' => 8100,
            'secrets' => $secrets,
            'makeDefault' => false,
        ];
    }

    /**
     * @return TestResponse<Response>
     */
    private function write(string $method, string $path): TestResponse
    {
        return $this->actingAs($this->owner)->{$method}($path, [], ['Idempotency-Key' => (string) Str::ulid()]);
    }
}
