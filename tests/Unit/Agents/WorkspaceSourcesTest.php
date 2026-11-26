<?php

declare(strict_types=1);

namespace Tests\Unit\Agents;

use App\Enums\Agents\WorkspaceUse;
use App\Enums\Projects\MountType;
use App\Exceptions\WorkspaceSourceMissing;
use App\Exceptions\WorkspaceSourcesInvalid;
use App\Support\ArrangementSetting;
use App\Support\ManifestMount;
use App\Support\MountRules;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

final class WorkspaceSourcesTest extends TestCase
{
    private const string SOURCES = '{"main":{"git":"git@github.com:acme/shop.git","revision":"main",'
        .'"deploy_key_secret":"deploy_key_main"},"staging":{"folder":"staging"}}';

    public function test_a_contained_start_with_a_git_source_mounts_its_environments_volume(): void
    {
        $rules = ArrangementSetting::fromConfig('contained', 'acme', self::SOURCES)->mountRules(null, 'main');

        $this->assertEquals(
            ManifestMount::volume('acme-workspace-main', '/workspace', true),
            $rules->workspaceMount('/ignored', WorkspaceUse::Shared),
        );
        $this->assertFalse($rules->workspaceMount('/ignored', WorkspaceUse::ReadOnly)->isWritable);
    }

    public function test_a_contained_start_with_a_folder_source_binds_its_server_folder(): void
    {
        $mount = ArrangementSetting::fromConfig('contained', 'acme', self::SOURCES)
            ->mountRules(null, 'staging')
            ->workspaceMount('/ignored', WorkspaceUse::Shared);

        $this->assertSame(MountType::DaemonBind, $mount->type);
        $this->assertSame('/srv/journal/workspaces/staging', $mount->source);
        $this->assertSame('/workspace', $mount->target);
    }

    public function test_a_contained_start_for_an_environment_without_a_source_is_refused_by_name(): void
    {
        $setting = ArrangementSetting::fromConfig('contained', 'acme', self::SOURCES);

        $this->expectException(WorkspaceSourceMissing::class);
        $this->expectExceptionMessage(WorkspaceSourceMissing::for('review')->getMessage());

        $setting->mountRules(null, 'review');
    }

    public function test_the_local_arrangement_ignores_the_sources_and_binds_the_starts_own_folder(): void
    {
        $rules = ArrangementSetting::fromConfig('local', '', '{}')->mountRules(null, 'review');

        $this->assertEquals(MountRules::local(), $rules);
        $this->assertEquals(
            ManifestMount::bind('/Users/me/work/shop', '/workspace', true),
            $rules->workspaceMount('/Users/me/work/shop', WorkspaceUse::Shared),
        );
    }

    /**
     * @return iterable<string, array{string, string}>
     */
    public static function invalidSources(): iterable
    {
        yield 'not json' => ['{main', 'not a JSON object'];

        yield 'a list' => ['[{"folder":"main"}]', 'not a JSON object'];

        yield 'both kinds' => ['{"main":{"git":"x","revision":"main","deploy_key_secret":"k","folder":"main"}}', 'both'];

        yield 'git without its key' => ['{"main":{"git":"x","revision":"main"}}', 'neither a folder'];
    }

    #[DataProvider('invalidSources')]
    public function test_malformed_sources_stop_the_journal_booting_with_a_named_cause(string $json, string $cause): void
    {
        $this->expectException(WorkspaceSourcesInvalid::class);
        $this->expectExceptionMessage($cause);

        ArrangementSetting::fromConfig('contained', 'acme', $json);
    }
}
