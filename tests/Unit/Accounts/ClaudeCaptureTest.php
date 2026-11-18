<?php

declare(strict_types=1);

namespace Tests\Unit\Accounts;

use PHPUnit\Framework\TestCase;

/**
 * The account-free Claude Code capture: its fixtures are well formed, the launch invocation keeps out every settings
 * and MCP source the journal did not supply, a signed-out account reports no credential, and the document names the
 * same pinned version and digest as the fixtures.
 */
final class ClaudeCaptureTest extends TestCase
{
    private const string FIXTURES = __DIR__.'/../../Fixtures/Accounts/Claude';

    public function test_the_launch_invocation_keeps_out_settings_and_mcp_the_journal_did_not_supply(): void
    {
        $capture = self::fixture('capture.json');

        $this->assertSame('2.1.323', $capture['version']);
        $this->assertContains('--restricted', $capture['launch_invocation']);
        $this->assertContains('--strict-mcp-config', $capture['launch_invocation']);
        $this->assertContains('--settings', $capture['launch_invocation']);
        $this->assertNotContains('--setting-sources', $capture['launch_invocation']);
        $this->assertNotContains('--bare', $capture['launch_invocation']);
        $this->assertSame([], $capture['home_after_runs']);
        $this->assertSame([], $capture['anthropic_config_directory_after_runs']);
    }

    public function test_a_signed_out_account_reports_no_credential_and_reaches_no_api(): void
    {
        $status = self::fixture('auth-status-signed-out.json');
        $run = self::fixture('restricted-print-signed-out.json');

        $this->assertFalse($status['loggedIn']);
        $this->assertSame('none', $status['authMethod']);
        $this->assertSame('<config>', $status['configDirectory']);
        $this->assertTrue($run['is_error']);
        $this->assertSame(0, $run['duration_api_ms']);
        $this->assertSame(0, $run['total_cost_usd']);
        $this->assertStringStartsWith('Not logged in', $run['result']);
    }

    public function test_the_document_names_the_pinned_version_and_digest(): void
    {
        $capture = self::fixture('capture.json');
        $document = (string) file_get_contents(__DIR__.'/../../../docs/accounts/claude-integration.md');

        $this->assertStringContainsString("Claude Code {$capture['version']}", $document);
        $this->assertStringContainsString($capture['binary_sha256'], $document);
    }

    /**
     * @return array<string, mixed>
     */
    private static function fixture(string $name): array
    {
        $text = (string) file_get_contents(self::FIXTURES.'/'.$name);
        $fixture = json_decode($text, true, 16, JSON_THROW_ON_ERROR);
        self::assertIsArray($fixture);

        return $fixture;
    }
}
