<?php

declare(strict_types=1);

namespace Tests\Commands\Projects;

use App\Bus\Contracts\CommandBus;
use App\Connections\Data\ReleaseOfferData;
use App\Connections\InstallLineAvailability;
use App\Connections\PublishedReleases;
use App\Connections\Values\ReleaseManifest;
use App\Models\Projects\ProjectInvitation;
use App\Projects\Commands\IssueProjectInvitation\IssueProjectInvitationCommand;
use App\Projects\Enums\InstallLineHold;
use App\Settings\Commands\SetBooleanSetting\SetBooleanSettingCommand;
use App\Settings\Values\SettingReference;
use Carbon\CarbonImmutable;
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
        config(['journal.agents.server_origin' => 'https://journal.example.com']);
        Event::listen(MessageLogged::class, function (MessageLogged $logged): void {
            $this->logLines[] = $logged->message.' '.json_encode($logged->context);
        });
    }

    public function test_the_owner_gets_one_line_and_no_log_or_row_holds_its_ticket(): void
    {
        $this->switchOn();

        $ticket = $this->ticketOf($this->issue('action-1'));
        $this->assertSame(1, ProjectInvitation::query()->withTicket($ticket)->count());
        $this->assertNull(ProjectInvitation::query()->sole()->spent_at);

        foreach ($this->logLines as $line) {
            $this->assertStringNotContainsString($ticket, $line);
        }

        foreach ([
            'command_receipts',
            'project_invitations',
            'install_attempts',
        ] as $table) {
            $this->assertStringNotContainsString($ticket, (string) json_encode(DB::table($table)->get()));
        }
    }

    public function test_asking_again_under_the_same_action_replaces_the_line_and_the_old_ticket_is_spent(): void
    {
        $this->switchOn();

        $first = $this->ticketOf($this->issue('action-1'));
        $second = $this->ticketOf($this->issue('action-1'));

        $this->assertNotSame($first, $second);
        $this->assertSame(1, ProjectInvitation::query()->pending()->count());
        $this->assertSame(
            [false, true],
            [$this->isRedeemable($first), $this->isRedeemable($second)],
        );
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
            'journal.files.places.releases' => $folder,
            'journal.agents.release' => self::VERSION,
            'journal.agents.server_origin' => 'https://journal.example.com',
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
            'journal.files.places.releases' => $folder,
            'journal.agents.release' => self::VERSION,
            'journal.agents.server_origin' => 'https://journal.example.com',
        ]);

        $this->switchOn();
        config(['journal.agents.server_origin' => 'http://journal.example.com']);

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
            'journal.files.places.releases' => $folder,
            'journal.agents.release' => self::VERSION,
            'journal.agents.server_origin' => 'https://journal.example.com',
        ]);

        $this->switchOn();
        config(['journal.agents.release' => '']);

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
            'journal.files.places.releases' => $folder,
            'journal.agents.release' => self::VERSION,
            'journal.agents.server_origin' => 'https://journal.example.com',
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
            'journal.files.places.releases' => $folder,
            'journal.agents.release' => self::VERSION,
            'journal.agents.server_origin' => 'https://journal.example.com',
        ]);

        $this->switchOn();

        $offer = $this->offer();

        $this->assertTrue($this->availability()->canIssue());
        $this->assertSame([], $offer->missingCapabilities);
        $this->assertSame(
            ['darwin-arm64', 9_004_000, [
                'git',
                'curl',
            ], true],
            [
                $offer->targets[0]->name,
                $offer->targets[0]->bytes,
                $offer->targets[0]->prerequisites,
                $offer->targets[0]->isSupported,
            ],
        );
    }

    public function test_a_platform_naming_no_prerequisite_is_withheld_and_issues_no_line_alone(): void
    {
        $folder = sys_get_temp_dir().'/releases-'.bin2hex(random_bytes(4));
        mkdir("{$folder}/".self::VERSION, 0755, true);
        file_put_contents(
            "{$folder}/".self::VERSION.'/manifest.json',
            (string) json_encode(PublicRelease::manifest(self::VERSION)),
        );
        config([
            'journal.files.places.releases' => $folder,
            'journal.agents.release' => self::VERSION,
            'journal.agents.server_origin' => 'https://journal.example.com',
        ]);

        $this->switchOn();
        $manifest = PublicRelease::manifest(self::VERSION);
        $manifest['targets'][0]['prerequisites'] = [];
        $this->publish($manifest);

        $this->assertFalse($this->offer()->targets[0]->isSupported);
        $this->assertFalse($this->availability()->canIssue());
    }

    private function isRedeemable(string $ticket): bool
    {
        return ProjectInvitation::query()->withTicket($ticket)->sole()->isRedeemableAt(CarbonImmutable::now());
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
                'prerequisites' => [
                    'git',
                    'curl',
                ],
                'artifacts' => [$relay('linux-amd64')],
            ]],
        ]));
        config(['journal.files.places.releases' => $folder, 'journal.agents.release' => self::VERSION]);
    }

    /**
     * @param  array<string, mixed>  $manifest
     */
    private function publish(array $manifest): void
    {
        $folder = config()->string('journal.files.places.releases');
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
