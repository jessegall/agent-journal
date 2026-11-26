<?php

declare(strict_types=1);

namespace Tests\Unit\Accounts;

use PHPUnit\Framework\TestCase;

/**
 * The account-free Codex capture: a signed-out exec ends with turn.failed while exiting 0, the app-server offers the
 * methods the arrangement relies on, an empty trusted working root loads no project configuration, and the document
 * names the same pinned version.
 */
final class CodexCaptureTest extends TestCase
{
    private const string MISSING_BEARER = 'Missing bearer';

    private const string VERSION_LINE = 'codex-cli %s';

    private const string FIXTURES = __DIR__.'/../../Fixtures/Accounts/Codex';

    public function test_a_signed_out_exec_fails_its_turn_but_exits_zero(): void
    {
        $capture = self::capture();
        $lines = explode("\n", (string) file_get_contents(self::FIXTURES.'/exec-signed-out.jsonl'));
        $events = array_map(
            fn (string $line) => json_decode($line, true, 16, JSON_THROW_ON_ERROR),
            array_values(array_filter($lines)),
        );

        $this->assertSame(0, $capture['exec_signed_out']['exit']);
        $this->assertSame('thread.started', $events[0]['type']);
        $this->assertSame('turn.failed', $events[array_key_last($events)]['type']);
        $this->assertStringContainsString(self::MISSING_BEARER, $events[array_key_last($events)]['error']['message']);
        $this->assertSame(['stdout' => 'Not logged in', 'exit' => 1], $capture['login_status_signed_out']);
    }

    public function test_the_app_server_offers_sign_in_and_one_owner_executions(): void
    {
        $server = self::capture()['app_server'];

        foreach (['account/login/start', 'account/login/cancel', 'account/read', 'account/logout'] as $method) {
            $this->assertContains($method, $server['account_requests']);
        }

        $this->assertContains('account/login/completed', $server['account_notifications']);
        $this->assertContains('chatgptDeviceCode', $server['login_start_types']);
        $this->assertSame(['input', 'threadId'], $server['turn_start_required']);
        $this->assertContains('turn/completed', $server['execution_notifications']);
    }

    public function test_only_an_empty_trusted_working_root_keeps_work_folder_configuration_out(): void
    {
        $project = self::capture()['project_config'];

        $this->assertFalse($project['untrusted_folder_layer_loaded']);
        $this->assertTrue($project['trusted_exact_folder_layer_loaded']);
        $this->assertFalse($project['cli_override_empties_a_table']);
        $this->assertFalse($project['trusted_empty_folder_layer_loaded']);
    }

    public function test_the_document_names_the_pinned_version_and_digest(): void
    {
        $capture = self::capture();
        $document = (string) file_get_contents(__DIR__.'/../../../docs/accounts/codex-integration.md');

        $this->assertStringContainsString(sprintf(self::VERSION_LINE, $capture['version']), $document);
        $this->assertStringContainsString($capture['binary_sha256'], $document);
    }

    /**
     * @return array<string, mixed>
     */
    private static function capture(): array
    {
        $text = (string) file_get_contents(self::FIXTURES.'/capture.json');
        $capture = json_decode($text, true, 16, JSON_THROW_ON_ERROR);
        self::assertIsArray($capture);

        return $capture;
    }
}
