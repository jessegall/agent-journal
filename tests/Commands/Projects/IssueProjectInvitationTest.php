<?php

declare(strict_types=1);

namespace Tests\Commands\Projects;

use App\Commands\Projects\IssueProjectInvitation\IssueProjectInvitationCommand;
use App\Commands\Settings\SetBooleanSetting\SetBooleanSettingCommand;
use App\Contracts\Bus\CommandBus;
use App\Data\Connections\ReleaseOfferData;
use App\Enums\Projects\InstallLineHold;
use App\Models\Projects\ProjectInvitation;
use App\Support\InstallLineAvailability;
use App\Support\PublishedReleases;
use App\Values\ReleaseManifest;
use App\Values\ReleaseTarget;
use App\Values\SettingReference;
use Illuminate\Log\Events\MessageLogged;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Tests\Support\CommitsHookRows;
use Tests\Support\Connections\IssuesInstallLines;
use Tests\Support\Connections\PublicRelease;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * The owner gets one install line whose script downloads and no log or row holds its ticket; a viewer and a signed-out
 * visitor are refused, asking again replaces the line, and no line is issued while connecting projects is off.
 */
#[TestsCommand(IssueProjectInvitationCommand::class)]
final class IssueProjectInvitationTest extends TestCase
{
    use CommitsHookRows;
    use IssuesInstallLines;

    private const array TABLES = [
        'command_receipts',
        'connection_audits',
        'project_invitations',
        'install_attempts',
        'projects',
        'settings_records',
        'users',
    ];

    private const string VERSION = '1.0.0';

    private const string LINE = '#\Acurl -fsSL https://journal\.example\.com/install/([A-Za-z0-9_-]{43}) \| sh\z#';

    /**
     * @var list<string>
     */
    private array $logLines = [];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();
        $this->publishRelease();
        config(['agents.server_origin' => 'https://journal.example.com']);
        Event::listen(MessageLogged::class, function (MessageLogged $logged): void {
            $this->logLines[] = $logged->message.' '.json_encode($logged->context);
        });
    }

    public function test_the_owner_gets_one_line_whose_script_downloads_and_no_log_or_row_holds_its_ticket(): void
    {
        $this->switchOn();

        $ticket = $this->ticketOf($this->issue('action-1'));
        $this->assertSame(1, ProjectInvitation::query()->count());
        $script = $this->get("/install/{$ticket}")->assertOk();
        $this->assertStringContainsString($ticket, (string) $script->getContent());
        $this->get("/install/{$ticket}")->assertOk();
        $this->assertNull(ProjectInvitation::query()->sole()->spent_at);

        foreach ($this->logLines as $line) {
            $this->assertStringNotContainsString($ticket, $line);
        }

        foreach (['command_receipts', 'project_invitations', 'install_attempts'] as $table) {
            $this->assertStringNotContainsString($ticket, (string) json_encode(DB::table($table)->get()));
        }
    }

    public function test_a_viewer_and_a_signed_out_visitor_are_refused_and_leave_no_pending_line(): void
    {
        $this->switchOn();
        $viewer = $this->journal->user('Viewer')->userCalled('Viewer');

        $this->assertFalse($this->actingAs($viewer)->postJson('/project-connections/invitations', [
            'issuanceKey' => 'action-1',
        ])->isSuccessful());
        $this->app['auth']->forgetGuards();
        $this->assertFalse($this->postJson('/project-connections/invitations', [
            'issuanceKey' => 'action-1',
        ])->isSuccessful());

        $this->assertSame(0, ProjectInvitation::query()->count());
    }

    public function test_asking_again_under_the_same_action_replaces_the_line_and_the_old_ticket_fails(): void
    {
        $this->switchOn();

        $first = $this->ticketOf($this->issue('action-1'));
        $second = $this->ticketOf($this->issue('action-1'));

        $this->assertNotSame($first, $second);
        $this->assertSame(1, ProjectInvitation::query()->pending()->count());
        $this->get("/install/{$first}")->assertNotFound();
        $this->get("/install/{$second}")->assertOk();
    }

    public function test_no_line_is_issued_while_connecting_projects_is_switched_off(): void
    {
        $this->assertIsString($this->refusedLine(['issuanceKey' => 'action-1']));

        $this->assertSame(0, ProjectInvitation::query()->count());
    }

    public function test_install_lines_are_issued_with_the_switch_on_an_https_origin_and_a_compatible_release(): void
    {
        $folder = sys_get_temp_dir().'/releases-'.bin2hex(random_bytes(4));
        mkdir("{$folder}/".self::VERSION, 0755, true);
        file_put_contents(
            "{$folder}/".self::VERSION.'/manifest.json',
            (string) json_encode(PublicRelease::manifest(self::VERSION)),
        );
        config([
            'files.places.releases' => $folder,
            'agents.release' => self::VERSION,
            'agents.server_origin' => 'https://journal.example.com',
        ]);

        $this->switchOn();

        $this->assertTrue($this->availability()->canIssue());
    }

    public function test_an_http_origin_issues_no_install_line(): void
    {
        $folder = sys_get_temp_dir().'/releases-'.bin2hex(random_bytes(4));
        mkdir("{$folder}/".self::VERSION, 0755, true);
        file_put_contents(
            "{$folder}/".self::VERSION.'/manifest.json',
            (string) json_encode(PublicRelease::manifest(self::VERSION)),
        );
        config([
            'files.places.releases' => $folder,
            'agents.release' => self::VERSION,
            'agents.server_origin' => 'https://journal.example.com',
        ]);

        $this->switchOn();
        config(['agents.server_origin' => 'http://journal.example.com']);

        $this->assertSame([InstallLineHold::OriginNotHttps], $this->availability()->holds());
    }

    public function test_no_published_release_issues_no_install_line(): void
    {
        $folder = sys_get_temp_dir().'/releases-'.bin2hex(random_bytes(4));
        mkdir("{$folder}/".self::VERSION, 0755, true);
        file_put_contents(
            "{$folder}/".self::VERSION.'/manifest.json',
            (string) json_encode(PublicRelease::manifest(self::VERSION)),
        );
        config([
            'files.places.releases' => $folder,
            'agents.release' => self::VERSION,
            'agents.server_origin' => 'https://journal.example.com',
        ]);

        $this->switchOn();
        config(['agents.release' => '']);

        $this->assertSame([InstallLineHold::NoRelease], $this->availability()->holds());
    }

    public function test_a_release_without_measured_sizes_issues_no_install_line(): void
    {
        $folder = sys_get_temp_dir().'/releases-'.bin2hex(random_bytes(4));
        mkdir("{$folder}/".self::VERSION, 0755, true);
        file_put_contents(
            "{$folder}/".self::VERSION.'/manifest.json',
            (string) json_encode(PublicRelease::manifest(self::VERSION)),
        );
        config([
            'files.places.releases' => $folder,
            'agents.release' => self::VERSION,
            'agents.server_origin' => 'https://journal.example.com',
        ]);

        $this->switchOn();
        $manifest = PublicRelease::manifest(self::VERSION);
        unset($manifest['targets'][0]['artifacts'][0]['size']);
        $this->publish($manifest);

        $this->assertFalse($this->availability()->canIssue());
        $this->assertFalse($this->offer()->targets[0]->isMeasured);
    }

    public function test_a_full_release_shows_its_platforms_with_their_sizes_and_prerequisites(): void
    {
        $folder = sys_get_temp_dir().'/releases-'.bin2hex(random_bytes(4));
        mkdir("{$folder}/".self::VERSION, 0755, true);
        file_put_contents(
            "{$folder}/".self::VERSION.'/manifest.json',
            (string) json_encode(PublicRelease::manifest(self::VERSION)),
        );
        config([
            'files.places.releases' => $folder,
            'agents.release' => self::VERSION,
            'agents.server_origin' => 'https://journal.example.com',
        ]);

        $this->switchOn();

        $offer = $this->offer();

        $this->assertTrue($this->availability()->canIssue());
        $this->assertSame([], $offer->missingCapabilities);
        $this->assertSame(
            ['darwin-arm64', 9_000_000, ['git', 'curl'], [], true],
            [$offer->targets[0]->name, $offer->targets[0]->bytes, $offer->targets[0]->prerequisites,
                $offer->targets[0]->missingProviders, $offer->targets[0]->isSupported],
        );
    }

    public function test_a_platform_missing_a_provider_shows_it_withheld_and_issues_no_line_alone(): void
    {
        $folder = sys_get_temp_dir().'/releases-'.bin2hex(random_bytes(4));
        mkdir("{$folder}/".self::VERSION, 0755, true);
        file_put_contents(
            "{$folder}/".self::VERSION.'/manifest.json',
            (string) json_encode(PublicRelease::manifest(self::VERSION)),
        );
        config([
            'files.places.releases' => $folder,
            'agents.release' => self::VERSION,
            'agents.server_origin' => 'https://journal.example.com',
        ]);

        $this->switchOn();
        $manifest = PublicRelease::manifest(self::VERSION);
        $manifest['targets'][0]['providers'] = [];
        $this->publish($manifest);

        $this->assertSame(['claude-code'], $this->offer()->targets[0]->missingProviders);
        $this->assertFalse($this->offer()->targets[0]->isSupported);
        $this->assertFalse($this->availability()->canIssue());
    }

    /**
     * @return array<string, mixed>
     */
    private function issue(string $issuanceKey): array
    {
        return $this->issuedLine(['issuanceKey' => $issuanceKey]);
    }

    /**
     * @param  array<string, mixed>  $issued
     */
    private function ticketOf(array $issued): string
    {
        $this->assertMatchesRegularExpression(self::LINE, (string) $issued['installLine']);
        preg_match(self::LINE, (string) $issued['installLine'], $match);

        return $match[1];
    }

    private function switchOn(): void
    {
        $this->journal->actAsUserId($this->journal->ownerUser()->id);
        $this->app->make(CommandBus::class)->run(
            new SetBooleanSettingCommand(new SettingReference('Core', 'remote_projects'), true, 0),
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
            'capabilities' => ReleaseManifest::REQUIRED_CAPABILITIES,
            'targets' => [[
                'os' => 'linux',
                'arch' => 'amd64',
                'prerequisites' => ['git', 'curl'],
                'providers' => ReleaseTarget::REQUIRED_PROVIDERS,
                'artifacts' => [$relay('linux-amd64')],
            ]],
        ]));
        config(['files.places.releases' => $folder, 'agents.release' => self::VERSION]);
    }

    /**
     * @param  array<string, mixed>  $manifest
     */
    private function publish(array $manifest): void
    {
        $folder = config()->string('files.places.releases');
        file_put_contents("{$folder}/".self::VERSION.'/manifest.json', (string) json_encode($manifest));
    }

    private function availability(): InstallLineAvailability
    {
        $this->app->forgetInstance(InstallLineAvailability::class);

        return $this->app->make(InstallLineAvailability::class);
    }

    private function offer(): ReleaseOfferData
    {
        return ReleaseOfferData::ofPublished($this->app->make(PublishedReleases::class)->currentRelease());
    }
}
