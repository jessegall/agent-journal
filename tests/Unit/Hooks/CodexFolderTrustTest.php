<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks;

use App\Exceptions\FolderTrustRefused;
use App\Support\Drivers\AccountConfigurationWrite;
use App\Support\Drivers\CodexFolderTrust;
use Illuminate\Filesystem\Filesystem;
use PHPUnit\Framework\TestCase;

/**
 * Codex trusts only an empty working root the journal made, by its exact path, and every new trust is added to the
 * account's config.toml without losing what it already holds.
 */
final class CodexFolderTrustTest extends TestCase
{
    private const string HOOKS_HEAD = "cli_auth_credentials_store = \"file\"\n\n[hooks]\n";

    private const string FEATURES_HEAD = "cli_auth_credentials_store = \"file\"\n[features]\nmulti_agent = false\n";

    private const string TRUSTED_TWO = "[projects.\"%s/roots/two\"]\ntrust_level = \"trusted\"";

    private string $base;

    protected function setUp(): void
    {
        parent::setUp();

        $this->base = sys_get_temp_dir().'/codex-trust-'.bin2hex(random_bytes(4));
        mkdir($this->base.'/roots/one', 0700, true);
        mkdir($this->base.'/roots/two', 0700, true);
        mkdir($this->base.'/account', 0700, true);
    }

    protected function tearDown(): void
    {
        new Filesystem()->deleteDirectory($this->base);

        parent::tearDown();
    }

    public function test_trusts_are_added_once_beside_every_existing_entry(): void
    {
        $config = $this->base.'/account/config.toml';
        file_put_contents(
            $config,
            "cli_auth_credentials_store = \"file\"\n\n[hooks]\nsession_start = \"journal-hook\"\n",
        );
        $write = new AccountConfigurationWrite();
        $one = CodexFolderTrust::forWorkingRoot($this->base.'/roots', $this->base.'/roots/one');
        $two = CodexFolderTrust::forWorkingRoot($this->base.'/roots', $this->base.'/roots/two');

        $this->assertTrue($write->addTrust($this->base.'/account', $one));
        $this->assertFalse($write->addTrust($this->base.'/account', $one));
        $this->assertTrue($write->addTrust($this->base.'/account', $two));

        $written = (string) file_get_contents($config);
        $this->assertStringStartsWith(self::HOOKS_HEAD, $written);
        $this->assertSame(1, substr_count($written, '[projects."'.$this->base.'/roots/one"]'));
        $this->assertStringContainsString(sprintf(self::TRUSTED_TWO, $this->base), $written);
        $this->assertSame([], glob($this->base.'/account/config.toml.*.new') ?: []);
    }

    public function test_a_preparation_adds_the_file_store_and_hook_tables_once_and_keeps_every_entry(): void
    {
        $config = $this->base.'/account/config.toml';
        file_put_contents($config, "[features]\nmulti_agent = false\n");
        $write = new AccountConfigurationWrite();
        $hooks = "[hooks.state.\"hooks.json:pre_tool_use:0:0\"]\nenabled = true\n";
        $one = CodexFolderTrust::forWorkingRoot($this->base.'/roots', $this->base.'/roots/one');
        $two = CodexFolderTrust::forWorkingRoot($this->base.'/roots', $this->base.'/roots/two');

        $this->assertTrue(
            $write->prepare($this->base.'/account', ['cli_auth_credentials_store' => '"file"'], [$hooks], $one, []),
        );
        $this->assertFalse(
            $write->prepare($this->base.'/account', ['cli_auth_credentials_store' => '"file"'], [$hooks], $one, []),
        );
        $this->assertTrue(
            $write->prepare($this->base.'/account', ['cli_auth_credentials_store' => '"file"'], [$hooks], $two, []),
        );

        $written = (string) file_get_contents($config);
        $this->assertStringStartsWith(self::FEATURES_HEAD, $written);
        $this->assertSame(1, substr_count($written, 'cli_auth_credentials_store'));
        $this->assertSame(1, substr_count($written, '[hooks.state.'));
        $this->assertSame(1, substr_count($written, '[projects."'.$this->base.'/roots/one"]'));
        $this->assertSame(1, substr_count($written, '[projects."'.$this->base.'/roots/two"]'));
    }

    public function test_a_root_holding_project_settings_is_never_trusted(): void
    {
        mkdir($this->base.'/roots/one/.codex');
        file_put_contents($this->base.'/roots/one/.codex/config.toml', "[mcp_servers.hostile]\ncommand = \"x\"\n");

        $this->expectException(FolderTrustRefused::class);

        CodexFolderTrust::forWorkingRoot($this->base.'/roots', $this->base.'/roots/one');
    }

    public function test_a_parent_or_a_work_folder_is_never_trusted(): void
    {
        foreach ([$this->base.'/roots', $this->base.'/account', $this->base.'/roots/one/..'] as $folder) {
            try {
                CodexFolderTrust::forWorkingRoot($this->base.'/roots', $folder);
                $this->fail("{$folder} was trusted.");
            } catch (FolderTrustRefused) {
                $this->addToAssertionCount(1);
            }
        }
    }
}
