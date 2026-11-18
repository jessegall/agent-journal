<?php

declare(strict_types=1);

namespace Tests\Feature\Sharing;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\CommandBus;
use App\Records\Support\RecordIdentity;
use App\Sharing\Enums\ShareState;
use App\Sharing\Models\Share;
use App\Sharing\Models\ShareGatewayConfiguration;
use App\Sharing\Support\GatewaySettings;
use App\Sharing\Support\ShareReadLimits;
use App\Sharing\Support\ShareToken;
use Carbon\CarbonImmutable;
use Domain\Access\Support\AccessSettings;
use Domain\Documents\Commands\CreateDocument;
use Domain\Documents\Models\Document;
use Illuminate\Contracts\Console\Kernel;
use Illuminate\Foundation\Application;
use RuntimeException;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * The share-only listener: a valid link answers with the safe headers and no cookie; other methods, upgrades and
 * every other route are refused; reads are limited per share and invalid links in all, never holding a valid link;
 * a failure shows the fixed page even with debugging on.
 */
final class SharingListenerTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['share_audits', 'share_members', 'shares', 'share_gateway_configurations', 'links', 'comments', 'document_closes', 'document_drafts', 'reports', 'document_revisions', 'documents', 'number_groups'];

    private string $token;

    private ShareGatewayConfiguration $configuration;

    public function createApplication(): Application
    {
        $app = require Application::inferBasePath().'/bootstrap/sharing.php';
        $app->make(Kernel::class)->bootstrap();

        return $app;
    }

    protected function setUp(): void
    {
        parent::setUp();

        config(['sharing.rate_limit_store' => 'array']);

        $this->app->instance(AccessSettings::class, new AccessSettings(TestIds::of(9)));
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser(TestIds::of(9)));
        $this->app->make(CommandBus::class)->run(new CreateDocument('Design', 'What we build', "# Goal\nShip it.\n"));
        $this->app->make(CurrentActorSetter::class)->clear();
        $configuration = ShareGatewayConfiguration::configure(new GatewaySettings('press', '1.0.0', 'example.test', 'https://share.example.test', 8100, []));
        $this->configuration = $configuration;
        $this->token = $this->activeShareOf(Document::query()->sole()->shareIdentity());
    }

    public function test_a_valid_link_answers_with_the_safe_headers_and_no_cookie(): void
    {
        $response = $this->withCookie('journal_session', 'owner')->get("/s/{$this->token}");

        $response->assertOk()->assertSee('Design')->assertSee('Ship it.');
        $this->assertStringContainsString('no-store', (string) $response->headers->get('Cache-Control'));
        $response->assertHeader('Referrer-Policy', 'no-referrer');
        $response->assertHeader('X-Frame-Options', 'DENY');
        $response->assertHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
        $this->assertStringContainsString("default-src 'none'", (string) $response->headers->get('Content-Security-Policy'));
        $this->assertSame([], $response->headers->getCookies());
    }

    public function test_other_methods_upgrades_and_other_routes_are_refused(): void
    {
        $this->post("/s/{$this->token}")->assertStatus(405);
        $this->withHeader('Upgrade', 'websocket')->get("/s/{$this->token}")->assertStatus(400);
        $this->get('/login')->assertNotFound();
        $this->get('/')->assertNotFound();
        $this->get('/mcp')->assertNotFound();
        $this->get('/documents/docs/1')->assertNotFound();
        $this->get('/s/'.str_repeat('a', 43))->assertNotFound()->assertSee('This share is not available.');
    }

    public function test_a_share_read_too_often_gets_429_while_another_share_still_reads(): void
    {
        $limits = $this->app->make(ShareReadLimits::class);
        $busy = Share::query()->sole();
        $other = $this->activeShareOf(Document::query()->sole()->shareIdentity());

        foreach (range(1, 120) as $read) {
            $limits->admitRead($busy->id);
        }

        $this->get("/s/{$this->token}")->assertStatus(429);
        $this->get("/s/{$other}")->assertOk();
    }

    public function test_the_invalid_link_ceiling_ignores_forwarded_addresses_and_never_holds_a_valid_link(): void
    {
        $limits = $this->app->make(ShareReadLimits::class);

        foreach (range(1, 599) as $invalid) {
            $limits->countInvalid(null);
        }

        $this->withHeader('X-Forwarded-For', '203.0.113.7')->get('/s/'.str_repeat('a', 43))->assertNotFound();
        $this->withHeader('X-Forwarded-For', '198.51.100.9')->get('/s/'.str_repeat('b', 43))->assertStatus(429);
        $this->get("/s/{$this->token}")->assertOk();
    }

    public function test_a_failure_shows_the_fixed_page_even_with_debugging_on(): void
    {
        config(['app.debug' => true]);
        $token = $this->token;
        $this->app->instance(CommandBus::class, new class($token) implements CommandBus
        {
            public function __construct(private readonly string $token) {}

            public function run(Command $command): mixed
            {
                throw new RuntimeException("select * from shares where token = '{$this->token}'");
            }
        });

        $response = $this->get("/s/{$this->token}");

        $response->assertStatus(503)->assertSee('This share cannot be shown right now.');
        $this->assertStringNotContainsString($this->token, (string) $response->getContent());
        $this->assertStringNotContainsString('select', (string) $response->getContent());
    }

    private function activeShareOf(RecordIdentity $root): string
    {
        $token = ShareToken::generate();
        $share = Share::grant($root, TestIds::of(9), $this->configuration, $token, CarbonImmutable::now()->addDay());
        $share->state = ShareState::Active;
        $share->save();

        return $token->token;
    }
}
