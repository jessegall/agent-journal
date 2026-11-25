<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Commands\Settings\SetBooleanSetting\SetBooleanSettingCommand;
use App\Contracts\Bus\CommandBus;
use App\Data\Connections\ReleaseOfferData;
use App\Enums\Projects\InstallLineHold;
use App\Support\InstallLineAvailability;
use App\Support\PublishedReleases;
use App\Values\SettingReference;
use Tests\Support\CommitsHookRows;
use Tests\Support\Connections\PublicRelease;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * Install lines are issued only with remote projects switched on, an https origin and a compatible published release.
 */
final class InstallLineAvailabilityTest extends TestCase
{
    use CommitsHookRows;

    /**
     * The bus commits the settings commands for real, so this table is emptied around each test.
     */
    private const array TABLES = ['settings_records'];

    private const string VERSION = '1.0.0';

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->actAsUserId(TestIds::of(7));

        $folder = sys_get_temp_dir().'/releases-'.bin2hex(random_bytes(4));
        mkdir("{$folder}/".self::VERSION, 0755, true);
        file_put_contents("{$folder}/".self::VERSION.'/manifest.json', (string) json_encode(PublicRelease::manifest(self::VERSION)));
        config([
            'files.places.releases' => $folder,
            'agents.release' => self::VERSION,
            'agents.server_origin' => 'https://journal.example.com',
        ]);
    }

    public function test_install_lines_are_issued_with_the_switch_on_an_https_origin_and_a_compatible_release(): void
    {
        $this->switchOn();

        $this->assertTrue($this->availability()->canIssue());
    }

    public function test_an_http_origin_issues_no_install_line(): void
    {
        $this->switchOn();
        config(['agents.server_origin' => 'http://journal.example.com']);

        $this->assertSame([InstallLineHold::OriginNotHttps], $this->availability()->holds());
    }

    public function test_no_published_release_issues_no_install_line(): void
    {
        $this->switchOn();
        config(['agents.release' => '']);

        $this->assertSame([InstallLineHold::NoRelease], $this->availability()->holds());
    }

    public function test_a_release_without_measured_sizes_issues_no_install_line(): void
    {
        $this->switchOn();
        $manifest = PublicRelease::manifest(self::VERSION);
        unset($manifest['targets'][0]['artifacts'][0]['size']);
        $this->publish($manifest);

        $this->assertFalse($this->availability()->canIssue());
        $this->assertFalse($this->offer()->targets[0]->isMeasured);
    }

    public function test_a_full_release_shows_its_platforms_with_their_sizes_and_prerequisites(): void
    {
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
        $this->switchOn();
        $manifest = PublicRelease::manifest(self::VERSION);
        $manifest['targets'][0]['providers'] = [];
        $this->publish($manifest);

        $this->assertSame(['claude-code'], $this->offer()->targets[0]->missingProviders);
        $this->assertFalse($this->offer()->targets[0]->isSupported);
        $this->assertFalse($this->availability()->canIssue());
    }

    /**
     * @param  array<string, mixed>  $manifest
     */
    private function publish(array $manifest): void
    {
        $folder = config()->string('files.places.releases');
        file_put_contents("{$folder}/".self::VERSION.'/manifest.json', (string) json_encode($manifest));
    }

    private function offer(): ReleaseOfferData
    {
        return ReleaseOfferData::ofPublished($this->app->make(PublishedReleases::class)->currentRelease());
    }

    private function switchOn(): void
    {
        $this->app->make(CommandBus::class)->run(
            new SetBooleanSettingCommand(new SettingReference('Core', 'remote_projects'), true, 0),
        );
        $this->app->forgetScopedInstances();
    }

    private function availability(): InstallLineAvailability
    {
        $this->app->forgetInstance(InstallLineAvailability::class);

        return $this->app->make(InstallLineAvailability::class);
    }
}
