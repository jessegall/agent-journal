<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Agents\Enums\TransportProfileType;
use App\Hooks\Drivers\AccountConfigurationWrite;
use App\Hooks\Drivers\CodexFolderTrust;
use App\Hooks\Drivers\CodexJournalServer;
use App\Hooks\Exceptions\JournalServerUnresolved;
use Illuminate\Filesystem\Filesystem;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

/**
 * A Codex account's common config.toml gets the journal's MCP entry once, whole, under the account's lock: two
 * launches each keep their own root's trust and leave one entry; a later installation path replaces it; the entry
 * names only fixed paths and variable names, and a path that is relative, a placeholder or looks like a token is
 * refused.
 */
final class CodexMcpLaunchTest extends TestCase
{
    private const string PHP = '/protected/bin/php';

    private const string RELAY = '/protected/journal/bin/journal-mcp';

    private string $base;

    protected function setUp(): void
    {
        parent::setUp();

        $this->base = sys_get_temp_dir().'/codex-mcp-'.bin2hex(random_bytes(4));
        mkdir($this->base.'/roots/one', 0700, true);
        mkdir($this->base.'/roots/two', 0700, true);
        mkdir($this->base.'/account', 0700, true);
        file_put_contents($this->base.'/account/config.toml', "[hooks]\nsession_start = \"journal-hook\"\n");
    }

    protected function tearDown(): void
    {
        new Filesystem()->deleteDirectory($this->base);

        parent::tearDown();
    }

    public function test_two_launches_on_one_account_keep_their_trust_and_leave_one_journal_entry(): void
    {
        $this->prepare('one', CodexJournalServer::of(self::PHP, self::RELAY));
        $this->prepare('two', CodexJournalServer::of(self::PHP, self::RELAY));

        $config = $this->config();
        $this->assertSame(1, substr_count($config, CodexJournalServer::HEADER));
        $this->assertStringContainsString(sprintf('[projects."%s/roots/one"]', $this->base), $config);
        $this->assertStringContainsString(sprintf('[projects."%s/roots/two"]', $this->base), $config);
        $this->assertStringContainsString("[hooks]\nsession_start = \"journal-hook\"", $config);
        $this->assertStringContainsString(<<<'TOML'
            [mcp_servers.journal]
            command = "/protected/bin/php"
            args = ["/protected/journal/bin/journal-mcp"]
            env_vars = ["JOURNAL_URL", "JOURNAL_LAUNCH_REF"]
            required = true
            default_tools_approval_mode = "approve"
            startup_timeout_sec = 15
            tool_timeout_sec = 30
            TOML, $config);
    }

    public function test_a_new_installation_path_replaces_the_entry_whole(): void
    {
        $this->prepare('one', CodexJournalServer::of(self::PHP, self::RELAY));
        $this->prepare('two', CodexJournalServer::of('/protected-2/bin/php', '/protected-2/journal/bin/journal-mcp'));

        $config = $this->config();
        $this->assertSame(1, substr_count($config, CodexJournalServer::HEADER));
        $this->assertStringNotContainsString(self::RELAY, $config);
        $this->assertStringContainsString('args = ["/protected-2/journal/bin/journal-mcp"]', $config);
        $this->assertStringContainsString(sprintf('[projects."%s/roots/one"]', $this->base), $config);
    }

    public function test_the_journal_server_can_be_disabled_and_restored_under_the_account_lock(): void
    {
        $server = CodexJournalServer::of(self::PHP, self::RELAY);
        $this->prepare('one', $server, TransportProfileType::Cli);
        $this->assertStringContainsString("tool_timeout_sec = 30\nenabled = false", $this->config());

        $this->prepare('two', $server);
        $config = $this->config();
        $this->assertSame(1, substr_count($config, CodexJournalServer::HEADER));
        $this->assertStringNotContainsString('enabled = false', $config);
        $this->assertStringContainsString(sprintf('[projects."%s/roots/one"]', $this->base), $config);
    }

    /**
     * @return iterable<string, array{string}>
     */
    public static function unresolvedPaths(): iterable
    {
        yield 'relative' => ['bin/journal-mcp'];

        yield 'empty' => [''];

        yield 'placeholder' => ['/protected/${JOURNAL}/bin/journal-mcp'];

        yield 'a token' => ['/protected/'.str_repeat('a1B2', 12).'/journal-mcp'];

        yield 'named a token' => ['/tmp/token/journal-mcp'];
    }

    #[DataProvider('unresolvedPaths')]
    public function test_a_path_that_is_not_fixed_is_refused(string $relay): void
    {
        $this->expectException(JournalServerUnresolved::class);

        CodexJournalServer::of(self::PHP, $relay);
    }

    private function prepare(
        string $root,
        CodexJournalServer $server,
        TransportProfileType $transport = TransportProfileType::Mcp,
    ): void {
        new AccountConfigurationWrite()->prepare(
            $this->base.'/account',
            [],
            [],
            CodexFolderTrust::forWorkingRoot($this->base.'/roots', $this->base.'/roots/'.$root),
            [$server->tomlTable($transport)],
        );
    }

    private function config(): string
    {
        return (string) file_get_contents($this->base.'/account/config.toml');
    }
}
