<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Hosts\FolderWorkspace;
use App\Support\HelperMounts;
use Tests\Support\Docker\AgentDaemonFolders;

/**
 * Every folder the journal binds from the agent daemon is one the agent daemon's service is given in compose.yaml, so
 * no container is refused for a bind source the daemon does not have.
 */
final class AgentDaemonFoldersTest extends TestCase
{
    private const array BOUND_FOLDERS = [HelperMounts::ACCOUNTS_ROOT, HelperMounts::SESSIONS_ROOT, FolderWorkspace::ROOT];

    public function test_the_agent_daemon_is_given_every_folder_the_journal_binds_from_it(): void
    {
        $this->assertSame([], $this->foldersMissingFrom(base_path('compose.yaml')));
    }

    public function test_a_bound_folder_the_daemon_is_not_given_is_caught(): void
    {
        $fixture = base_path('tests/Fixtures/Architecture/Compose/daemon-without-sessions.yaml');

        $this->assertSame([HelperMounts::SESSIONS_ROOT], $this->foldersMissingFrom($fixture));
    }

    /**
     * @return list<string>
     */
    private function foldersMissingFrom(string $composeFile): array
    {
        return array_values(array_diff(self::BOUND_FOLDERS, AgentDaemonFolders::of($composeFile)));
    }
}
