<?php

declare(strict_types=1);

namespace Tests\Feature\Sharing;

use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\Command;
use App\Contracts\Bus\CommandBus;
use App\Enums\ShareState;
use App\Models\Sharing\Share;
use App\Models\Sharing\ShareGatewayConfiguration;
use App\Support\GatewaySettings;
use App\Support\RecordIdentity;
use App\Support\ShareGrant;
use App\Support\ShareReadLimits;
use App\Support\ShareToken;
use App\Values\OwnerAuthority;
use Carbon\CarbonImmutable;
use Domain\Access\Support\AccessSettings;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Models\Document;
use Illuminate\Contracts\Console\Kernel;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Foundation\Application;
use Tests\Support\CommitsHookRows;
use Tests\Support\Exceptions\SimulatedFailure;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * The share-only listener: a valid link answers with the safe headers and no cookie; other methods, upgrades and
 * every other route are refused; reads are limited per share and invalid links in all, never holding a valid link;
 * a failure shows the fixed page even with debugging on.
 */
#[TimeLimit(
    seconds: 5,
    reason: 'It boots the share-only application, commits real reads and empties twelve tables around each test.',
)]
final class SharingListenerTest extends TestCase
{
    use CommitsHookRows;

    private const string SHARED_TEXT = 'Ship it.';

    private const string ROBOTS_TAG = 'noindex, nofollow, noarchive';

    private const string DEFAULT_SOURCE = "default-src 'none'";

    private const string NOT_AVAILABLE = 'This share is not available.';

    private const string SITE_LINK = '<a rel="noopener noreferrer" href="https://example.com">site</a>';

    private const string CANNOT_BE_SHOWN = 'This share cannot be shown right now.';

    private const string AUDIT_REFUSAL = 'audit refused';

    private const array TABLES = [
        'share_audits',
        'share_members',
        'shares',
        'share_gateway_configurations',
        'links',
        'comments',
        'document_closes',
        'document_drafts',
        'reports',
        'document_revisions',
        'documents',
        'number_groups',
    ];

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

        $this->app->instance(AccessSettings::class, TestActors::accessSettings(9));
        $this->app->make(CurrentActorSetter::class)->set(TestActors::user(9), new OwnerAuthority('test'));
        $this->app->make(CommandBus::class)->run(new CreateDocumentCommand('Design', 'What we build', <<<'TEXT'
        # Goal
        Ship it.

        TEXT));
        $this->app->make(CurrentActorSetter::class)->clear();
        $configuration = ShareGatewayConfiguration::create(
            new GatewaySettings('press', '1.0.0', 'example.test', 'https://share.example.test', 8100, []),
        );
        $this->configuration = $configuration;
        $this->token = $this->activeShareOf(Document::query()->sole()->shareIdentity());
    }

    public function test_a_valid_link_answers_with_the_safe_headers_and_no_cookie(): void
    {
        $response = $this->withCookie('journal_session', 'owner')->get("/s/{$this->token}");

        $response->assertOk()->assertSee('Design')->assertSee(self::SHARED_TEXT);
        $this->assertStringContainsString('no-store', (string) $response->headers->get('Cache-Control'));
        $response->assertHeader('Referrer-Policy', 'no-referrer');
        $response->assertHeader('X-Frame-Options', 'DENY');
        $response->assertHeader('X-Robots-Tag', self::ROBOTS_TAG);
        $this->assertStringContainsString(
            self::DEFAULT_SOURCE,
            (string) $response->headers->get('Content-Security-Policy'),
        );
        $this->assertSame([], $response->headers->getCookies());
    }

    public function test_the_public_page_carries_no_broadcasting_configuration(): void
    {
        config(['broadcasting.connections.reverb.key' => 'reverb-key-of-the-owner']);

        $page = (string) $this->get("/s/{$this->token}")->assertOk()->getContent();

        $this->assertStringNotContainsString('reverb-key-of-the-owner', $page);
        $this->assertStringNotContainsStringIgnoringCase('reverb', $page);
        $this->assertStringNotContainsString('broadcasting/auth', $page);
    }

    public function test_other_methods_upgrades_and_other_routes_are_refused(): void
    {
        $this->post("/s/{$this->token}")->assertStatus(405);
        $this->get("/s/{$this->token}", ['Upgrade' => 'websocket'])->assertStatus(400);
        $this->get('/login')->assertNotFound();
        $this->get('/')->assertNotFound();
        $this->get('/mcp')->assertNotFound();
        $this->get('/documents/docs/1')->assertNotFound();
        $this->get('/s/'.str_repeat('a', 43))->assertNotFound()->assertSee(self::NOT_AVAILABLE);
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

    public function test_a_script_and_a_javascript_link_render_inert_and_only_manifest_files_are_served(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(TestActors::user(9), new OwnerAuthority('test'));
        $this->app->make(CommandBus::class)->run(
            new CreateDocumentCommand(
                'Tricks',
                'Inert',
                <<<'TEXT'
                <script>alert(1)</script>

                [run](javascript:alert(1)) [site](https://example.com) 
                TEXT
                    ."[other](/s/elsewhere)\n",
            ),
        );
        $this->app->make(CurrentActorSetter::class)->clear();
        $token = $this->activeShareOf(Document::query()->where('number', 2)->sole()->shareIdentity());

        $html = (string) $this->get("/s/{$token}")->assertOk()->getContent();

        $this->assertStringNotContainsString('<script', $html);
        $this->assertStringNotContainsString('javascript:', $html);
        $this->assertStringContainsString(self::SITE_LINK, $html);
        $this->assertStringNotContainsString('href="/s/elsewhere"', $html);
        $this->get('/build/manifest.json')->assertNotFound();
        $this->get('/build-sharing/manifest.json')->assertNotFound();
        $this->get('/build-sharing/assets/app.js')->assertNotFound();
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
                throw SimulatedFailure::of("select * from shares where token = '{$this->token}'");
            }
        });

        $response = $this->get("/s/{$this->token}");

        $response->assertStatus(503)->assertSee(self::CANNOT_BE_SHOWN);
        $this->assertStringNotContainsString($this->token, (string) $response->getContent());
        $this->assertStringNotContainsString('select', (string) $response->getContent());
    }

    public function test_a_read_whose_audit_fails_answers_a_neutral_503_with_no_content_and_a_retry_reads_afresh(): void
    {
        $database = $this->app->make(ConnectionInterface::class);
        $database->unprepared(<<<'SQL'
            CREATE FUNCTION refuse_read_audit() RETURNS trigger LANGUAGE plpgsql AS $$
            BEGIN
                IF NEW.type = 'read_allowed' THEN
                    RAISE EXCEPTION 'audit refused for the test';
                END IF;
                RETURN NEW;
            END $$;
            CREATE TRIGGER refuse_read_audit BEFORE INSERT ON share_audits
                FOR EACH ROW EXECUTE FUNCTION refuse_read_audit();
            SQL);

        try {
            $failed = $this->get("/s/{$this->token}");
        } finally {
            $database->unprepared('DROP TRIGGER refuse_read_audit ON share_audits; DROP FUNCTION refuse_read_audit();');
        }

        $failed->assertStatus(503)->assertSee(self::CANNOT_BE_SHOWN);
        $this->assertStringNotContainsString(self::SHARED_TEXT, (string) $failed->getContent());
        $this->assertStringNotContainsString(self::AUDIT_REFUSAL, (string) $failed->getContent());

        $this->get("/s/{$this->token}")->assertOk()->assertSee(self::SHARED_TEXT);
    }

    private function activeShareOf(RecordIdentity $root): string
    {
        $token = ShareToken::generate();
        $share = Share::create(
            $root,
            CarbonImmutable::now()->addDay(),
            new ShareGrant(
                TestIds::of(9),
                $this->configuration->id,
                $this->configuration->configuration_version,
                $token,
            ),
        );
        $share->state = ShareState::Active;
        $share->save();

        return $token->token;
    }
}
