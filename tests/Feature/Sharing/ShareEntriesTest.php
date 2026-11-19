<?php

declare(strict_types=1);

namespace Tests\Feature\Sharing;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\Bus\Contracts\CommandBus;
use App\Bus\Support\CommandRegistry;
use App\Sharing\Commands\ApproveShareRequest;
use App\Sharing\Commands\CreateShare;
use App\Sharing\Commands\ExpireShares;
use App\Sharing\Commands\ReadShare;
use App\Sharing\Commands\RefreshShareScope;
use App\Sharing\Commands\RequestShare;
use App\Sharing\Commands\RetryShare;
use App\Sharing\Commands\RevokeShare;
use App\Sharing\Commands\SaveSharePreview;
use App\Sharing\Enums\ShareState;
use App\Sharing\Models\Share;
use App\Sharing\Models\ShareGatewayConfiguration;
use App\Sharing\Models\SharePreview;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Documents\Commands\CreateDocument;
use Domain\Documents\Models\Document;
use Illuminate\Database\ConnectionInterface;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\SendsSignedCalls;
use Tests\Support\Sharing\FakeShareGateway;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * The entries to sharing: an agent proposes a share and reads its status over signed calls and the agent CLI, and is
 * never shown an address; the owner lists, creates, revokes and deliberately prints an address from the command line;
 * Core exports the entry commands and keeps the System ones private.
 */
#[TimeLimit(
    seconds: 10,
    reason: 'It commits a document through the bus, runs console commands and empties nineteen tables around each test.',
)]
final class ShareEntriesTest extends TestCase
{
    use CommitsHookRows;
    use SendsSignedCalls;

    private const array TABLES = [
        'command_receipts',
        'share_audits',
        'share_members',
        'share_gateway_operations',
        'shares',
        'share_previews',
        'share_gateway_configurations',
        'share_installations',
        'users',
        'links',
        'comments',
        'document_closes',
        'document_drafts',
        'reports',
        'document_revisions',
        'documents',
        'number_groups',
        'start_tokens',
        'agent_sessions',
        'agents',
    ];

    private User $owner;

    private Document $document;

    private ShareGatewayConfiguration $configuration;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser($this->owner->id),
            new OwnerAuthority('test'),
        );
        $this->app->make(CommandBus::class)->run(new CreateDocument('Design', 'What we build', <<<'TEXT'
        # Goal
        Ship it.

        TEXT));
        $this->app->make(CurrentActorSetter::class)->clear();
        $this->document = Document::query()->where('number', 1)->sole();
        $this->configuration = ShareGatewayConfiguration::configure(FakeShareGateway::settings());
    }

    public function test_an_agent_requests_a_share_and_reads_its_status_without_an_address(): void
    {
        $start = TestStart::start();

        $request = $this->signed(
            $start,
            '/agent/sharing/request',
            ['alias' => 'doc', 'number' => '1', 'request_key' => '01JD8X0G9M3QZ6V4K2AGENT0001'],
        )->assertOk();
        $this->assertSame(['number', 'state'], array_keys((array) $request->json()));
        $this->assertSame('proposed', $request->json('state'));

        $proposal = Share::query()->sole();
        $proposal->state = ShareState::Active;
        $proposal->save();

        $status = $this->signed($start, '/agent/sharing/status', [])->assertOk();
        $this->assertSame([['number' => $proposal->number, 'state' => 'active']], $status->json('proposals'));
        $this->assertStringNotContainsString('http', (string) $status->getContent());
    }

    public function test_the_agent_cli_requests_a_share_and_prints_number_and_state_only(): void
    {
        $start = TestStart::start();
        $this->runCommandsAs($start);

        $this->artisan('share:request', ['alias' => 'doc', 'number' => '1', '--json' => true])
            ->expectsOutputToContain('"state":"proposed"')
            ->doesntExpectOutputToContain('http')
            ->assertExitCode(0);
        $this->artisan('share:status', ['--json' => true])->expectsOutputToContain('"proposals"')->assertExitCode(0);

        $this->assertSame(ShareState::Proposed, Share::query()->sole()->state);
    }

    public function test_the_owner_lists_creates_revokes_and_prints_an_address_from_the_cli(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser($this->owner->id),
            new OwnerAuthority('test'),
        );
        $this->app->make(CommandBus::class)->run(
            new SaveSharePreview(
                $this->document->shareIdentity()->type,
                $this->document->id,
                [],
                $this->configuration->id,
            ),
        );
        $this->app->make(CurrentActorSetter::class)->clear();
        $preview = SharePreview::query()->sole();

        $this->artisan(
            'share:create',
            ['preview' => $preview->id, '--minutes' => '60'],
        )->expectsOutputToContain('is pending')->assertExitCode(0);
        $share = Share::query()->sole();
        $this->artisan('share:list')->expectsOutputToContain($share->id)->doesntExpectOutputToContain(
            FakeShareGateway::PUBLIC_ORIGIN,
        )->assertExitCode(0);
        $this->artisan('share:url', ['share' => $share->id])->assertExitCode(1);

        $share->state = ShareState::Active;
        $share->save();
        $this->artisan('share:url', ['share' => $share->id])->expectsOutputToContain(
            FakeShareGateway::PUBLIC_ORIGIN.'/s/',
        )->assertExitCode(0);

        $this->artisan(
            'share:revoke',
            ['share' => $share->id],
        )->expectsOutputToContain('is revoked')->assertExitCode(0);
        $this->artisan('share:url', ['share' => $share->id])->assertExitCode(1);
        $this->assertStringNotContainsString(
            FakeShareGateway::PUBLIC_ORIGIN,
            (string) json_encode($this->app->make(ConnectionInterface::class)->table('command_receipts')->get()->all()),
        );
    }

    public function test_core_exports_the_entry_commands_and_keeps_the_system_ones_private(): void
    {
        $registry = $this->app->make(CommandRegistry::class);

        foreach ([
            CreateShare::class,
            RequestShare::class,
            ApproveShareRequest::class,
            RefreshShareScope::class,
            RevokeShare::class,
            RetryShare::class,
            SaveSharePreview::class,
        ] as $command) {
            $this->assertTrue($registry->isExported($command), "{$command} is not exported.");
        }

        foreach ([ExpireShares::class, ReadShare::class] as $command) {
            $this->assertFalse($registry->isExported($command), "{$command} is exported.");
        }
    }
}
