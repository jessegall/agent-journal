<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Hosts\FolderWorkspace;
use App\Support\MountRules;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Symfony\Component\Yaml\Yaml;

/**
 * Every folder the journal binds from the agent daemon is one the agent daemon's service is given in compose.yaml, so
 * no container is refused for a bind source the daemon does not have.
 */
final class AgentDaemonFoldersTest extends TestCase
{
    private const string DAEMON_SERVICE = 'agent-docker';

    /**
     * A volume's target: the absolute path after its source, before any read-only or read-write mode.
     */
    private const string VOLUME_TARGET = '#:(/[^:]+)(?::r[ow])?$#';

    private const array BOUND_FOLDERS = [MountRules::ACCOUNTS_ROOT, MountRules::SESSIONS_ROOT, FolderWorkspace::ROOT];

    public function test_the_agent_daemon_is_given_every_folder_the_journal_binds_from_it(): void
    {
        $this->assertSame([], $this->foldersMissingFrom(base_path('compose.yaml')));
    }

    public function test_a_bound_folder_the_daemon_is_not_given_is_caught(): void
    {
        $fixture = base_path('tests/Fixtures/Architecture/Compose/daemon-without-sessions.yaml');

        $this->assertSame([MountRules::SESSIONS_ROOT], $this->foldersMissingFrom($fixture));
    }

    /**
     * @return list<string>
     */
    private function foldersMissingFrom(string $composeFile): array
    {
        /** @var array{services: array<string, array{volumes: list<string>}>} $compose */
        $compose = Yaml::parse(File::get($composeFile));
        $targets = array_map(
            fn (string $volume): string => Str::of($volume)->match(self::VOLUME_TARGET)->value(),
            $compose['services'][self::DAEMON_SERVICE]['volumes'],
        );

        return array_values(array_diff(self::BOUND_FOLDERS, $targets));
    }
}
