<?php

declare(strict_types=1);

namespace Tests\Feature\Connections;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\Agents\Enums\HostProtocolVersion;
use App\Agents\Values\ReleaseManifest;
use App\Agents\Values\ReleaseTarget;
use App\Bus\Contracts\CommandBus;
use App\Connections\Models\ProjectInvitation;
use App\Settings\Commands\SetBooleanSetting;
use App\Settings\Values\SettingReference;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Illuminate\Log\Events\MessageLogged;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Testing\TestResponse;
use Symfony\Component\HttpFoundation\Response;
use Tests\Support\CommitsHookRows;
use Tests\TestCase;

/**
 * The owner issues one-time install lines; anyone else is refused, asking again replaces the line, and the ticket
 * reaches neither a stored row nor a log line.
 */
final class InstallLinesTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['command_receipts', 'connection_audits', 'project_invitations', 'projects', 'settings_records', 'users'];

    private const string VERSION = '1.0.0';

    private const string LINE = '#\Acurl -fsSL https://journal\.example\.com/install/([A-Za-z0-9_-]{43}) \| sh\z#';

    private User $owner;

    /**
     * @var list<string>
     */
    private array $logLines = [];

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->publishRelease();
        config(['agents.server_origin' => 'https://journal.example.com']);
        Event::listen(MessageLogged::class, function (MessageLogged $logged): void {
            $this->logLines[] = $logged->message.' '.json_encode($logged->context);
        });
    }

    public function test_the_owner_gets_one_line_whose_script_downloads_and_no_log_or_row_holds_its_ticket(): void
    {
        $this->switchOn();

        $response = $this->issue('action-1')->assertCreated();

        $this->assertStringContainsString('no-store', (string) $response->headers->get('Cache-Control'));
        $ticket = $this->ticketOf($response);
        $this->assertSame(1, ProjectInvitation::query()->count());
        $script = $this->get("/install/{$ticket}")->assertOk();
        $this->assertStringContainsString($ticket, (string) $script->getContent());
        $this->get("/install/{$ticket}")->assertOk();
        $this->assertNull(ProjectInvitation::query()->sole()->spent_at);

        foreach ($this->logLines as $line) {
            $this->assertStringNotContainsString($ticket, $line);
        }

        foreach (['command_receipts', 'project_invitations'] as $table) {
            $this->assertStringNotContainsString($ticket, (string) json_encode(DB::table($table)->get()));
        }
    }

    public function test_a_viewer_and_a_signed_out_visitor_are_refused_and_leave_no_pending_line(): void
    {
        $this->switchOn();
        $viewer = User::factory()->create();

        $this->assertFalse($this->actingAs($viewer)->postJson('/settings/project-connections/invitations', [
            'issuanceKey' => 'action-1',
        ])->isSuccessful());
        $this->app['auth']->forgetGuards();
        $this->assertFalse($this->postJson('/settings/project-connections/invitations', [
            'issuanceKey' => 'action-1',
        ])->isSuccessful());

        $this->assertSame(0, ProjectInvitation::query()->count());
    }

    public function test_asking_again_under_the_same_action_replaces_the_line_and_the_old_ticket_fails(): void
    {
        $this->switchOn();

        $first = $this->ticketOf($this->issue('action-1')->assertCreated());
        $second = $this->ticketOf($this->issue('action-1')->assertCreated());

        $this->assertNotSame($first, $second);
        $this->assertSame(1, ProjectInvitation::query()->pending()->count());
        $this->get("/install/{$first}")->assertNotFound();
        $this->get("/install/{$second}")->assertOk();
    }

    public function test_a_revoked_line_answers_the_generic_failure(): void
    {
        $this->switchOn();
        $response = $this->issue('action-1');
        $ticket = $this->ticketOf($response);

        $this->actingAs($this->owner)
            ->deleteJson('/settings/project-connections/invitations/'.$response->json('invitationId'))
            ->assertNoContent();

        $this->assertSame(
            "journal: this install line cannot be used. Copy a new one from the journal.\n",
            $this->get("/install/{$ticket}")->assertNotFound()->getContent(),
        );
    }

    public function test_no_line_is_issued_while_connecting_projects_is_switched_off(): void
    {
        $this->issue('action-1')->assertConflict();

        $this->assertSame(0, ProjectInvitation::query()->count());
    }

    private function issue(string $issuanceKey): TestResponse
    {
        return $this->actingAs($this->owner)->postJson('/settings/project-connections/invitations', [
            'issuanceKey' => $issuanceKey,
        ]);
    }

    /**
     * @param  TestResponse<Response>  $response
     */
    private function ticketOf(TestResponse $response): string
    {
        $this->assertMatchesRegularExpression(self::LINE, (string) $response->json('installLine'));
        preg_match(self::LINE, (string) $response->json('installLine'), $match);

        return $match[1];
    }

    private function switchOn(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser($this->owner->id),
            new OwnerAuthority('test'),
        );
        $this->app->make(CommandBus::class)->run(
            new SetBooleanSetting(new SettingReference('Core', 'remote_projects'), true, 0),
        );
        $this->app->forgetScopedInstances();
    }

    private function publishRelease(): void
    {
        $folder = sys_get_temp_dir().'/install-lines-'.bin2hex(random_bytes(4));
        mkdir("{$folder}/".self::VERSION, 0755, true);
        $relay = fn (string $target) => [
            'name' => 'scripts/install-relay.sh',
            'source' => "{$target}/scripts/install-relay.sh",
            'sha256' => str_repeat('ab', 32),
            'size' => 10,
            'executable' => false,
        ];
        file_put_contents("{$folder}/".self::VERSION.'/manifest.json', (string) json_encode([
            'version' => self::VERSION,
            'hostProtocolVersion' => HostProtocolVersion::RemoteProject->value,
            'capabilities' => ReleaseManifest::CAPABILITIES,
            'targets' => [[
                'os' => 'linux',
                'arch' => 'amd64',
                'prerequisites' => ['git', 'curl'],
                'providers' => ReleaseTarget::PROVIDERS,
                'artifacts' => [$relay('linux-amd64')],
            ]],
        ]));
        config(['files.places.releases' => $folder, 'agents.release' => self::VERSION]);
    }
}
