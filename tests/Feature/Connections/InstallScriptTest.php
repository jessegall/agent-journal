<?php

declare(strict_types=1);

namespace Tests\Feature\Connections;

use App\Agents\Enums\HostProtocolVersion;
use App\Agents\Values\ReleaseManifest;
use App\Agents\Values\ReleaseTarget;
use App\Connections\Exceptions\TicketMalformed;
use App\Connections\Support\InstallScript;
use Symfony\Component\Process\Process;
use Tests\Support\CommitsHookRows;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * The script an install line pipes into sh: it parses, holds the ticket once and runs nothing before its last line.
 */
#[TimeLimit(seconds: 30, reason: 'It runs sh on every cut of the rendered script.')]
final class InstallScriptTest extends TestCase
{
    use CommitsHookRows;

    private const string CUT_RAN = 'a copy cut at byte %d ran a command';

    private const string NO_COMMAND_RAN = 'the whole script ran no command, so the cuts prove nothing';

    private const string UNUSABLE_LINE = 'journal: this install line cannot be used. '
        ."Copy a new one from the journal.\n";

    private const array TABLES = ['project_invitations', 'install_attempts', 'settings_records'];

    private const string VERSION = '1.0.0';

    private const string TICKET = 'Tk3_x-9QvZ0aB1cD2eF3gH4iJ5kL6mN7';

    private const string RELAY_SHA256 = 'aa11bb22cc33dd44ee55ff66aa11bb22cc33dd44ee55ff66aa11bb22cc33dd44';

    /**
     * What each platform of the test release offers: its prerequisites and both local providers.
     */
    private const array OFFERED = ['prerequisites' => ['git', 'curl'], 'providers' => ReleaseTarget::REQUIRED_PROVIDERS];

    private string $folder;

    protected function setUp(): void
    {
        parent::setUp();

        $this->folder = sys_get_temp_dir().'/install-script-'.bin2hex(random_bytes(4));
        mkdir("{$this->folder}/releases/".self::VERSION, 0755, true);
        mkdir("{$this->folder}/commands", 0755, true);
        file_put_contents("{$this->folder}/releases/".self::VERSION.'/manifest.json', $this->manifest());
        config([
            'files.places.releases' => "{$this->folder}/releases",
            'agents.release' => self::VERSION,
            'agents.server_origin' => 'https://journal.example.com/',
        ]);
    }

    public function test_the_rendered_script_parses_and_fills_in_the_origin_release_digest_and_ticket(): void
    {
        $script = $this->rendered();

        $check = new Process(['sh', '-n']);
        $check->setInput($script)->run();
        $this->assertTrue($check->isSuccessful(), $check->getErrorOutput());

        $this->assertStringContainsString("origin='https://journal.example.com'", $script);
        $this->assertStringContainsString("version='".self::VERSION."'", $script);
        $this->assertStringContainsString("relay_sha256='".self::RELAY_SHA256."'", $script);
        $this->assertStringNotContainsString('@@', $script);
    }

    public function test_the_ticket_is_in_the_script_exactly_once(): void
    {
        $this->assertSame(1, substr_count($this->rendered(), self::TICKET));
    }

    public function test_journal_install_is_called_only_on_the_last_line(): void
    {
        $lines = explode("\n", rtrim($this->rendered(), "\n"));

        $this->assertSame('journal_install', end($lines));
        $calls = array_filter($lines, fn (string $line) => str_contains($line, 'journal_install'));
        $this->assertSame(['journal_install() {', 'journal_install'], array_values($calls));
    }

    public function test_a_copy_cut_anywhere_before_the_last_line_runs_nothing(): void
    {
        $script = $this->rendered();
        $lastLine = strrpos(rtrim($script, "\n"), "\n");
        $this->assertIsInt($lastLine);

        $cuts = [];

        for ($offset = 0; $offset <= $lastLine; $offset += 7) {
            $cuts[] = $offset;
        }

        foreach (array_keys(explode("\n", substr($script, 0, $lastLine + 1))) as $line) {
            $cuts[] = strlen(implode("\n", array_slice(explode("\n", $script), 0, $line + 1)));
        }

        foreach (array_unique(array_filter($cuts, fn (int $cut) => $cut <= $lastLine)) as $cut) {
            $this->assertFalse($this->runs(substr($script, 0, $cut)), sprintf(self::CUT_RAN, $cut));
        }

        $this->assertTrue($this->runs($script), self::NO_COMMAND_RAN);
    }

    public function test_a_ticket_outside_base64url_is_refused(): void
    {
        foreach (["abc'def", 'abc def', 'abc/def', "abc\ndef", 'abc+def', 'abc=', ''] as $ticket) {
            try {
                $this->app->make(InstallScript::class)->render($ticket);
                $this->fail('a ticket outside base64url was rendered');
            } catch (TicketMalformed) {
                $this->addToAssertionCount(1);
            }
        }
    }

    public function test_the_install_route_answers_one_generic_failure_while_remote_projects_are_off(): void
    {
        $response = $this->get('/install/'.self::TICKET);

        $response->assertNotFound();
        $this->assertSame(self::UNUSABLE_LINE, $response->getContent());
        $this->assertStringContainsString('no-store', (string) $response->headers->get('Cache-Control'));
        $this->assertStringContainsString('private', (string) $response->headers->get('Cache-Control'));
        $this->assertFalse($response->headers->has('Location'));
        $this->assertSame($response->getContent(), $this->get('/install/another-ticket')->getContent());
    }

    private function rendered(): string
    {
        return $this->app->make(InstallScript::class)->render(self::TICKET);
    }

    /**
     * Whether sh, given the script, starts any command: every command the script could start leaves a mark.
     */
    private function runs(string $script): bool
    {
        $mark = "{$this->folder}/ran";

        if (file_exists($mark)) {
            unlink($mark);
        }

        foreach (['uname', 'mktemp', 'curl', 'grep', 'sha256sum', 'shasum', 'rm', 'sh'] as $command) {
            file_put_contents("{$this->folder}/commands/{$command}", "#!/bin/sh\n: > '{$mark}'\nexit 1\n");
            chmod("{$this->folder}/commands/{$command}", 0755);
        }

        $shell = new Process(['/bin/sh'], env: ['PATH' => "{$this->folder}/commands"]);
        $shell->setInput($script)->run();

        return file_exists($mark);
    }

    private function manifest(): string
    {
        $relay = fn (string $target) => [
            'name' => 'scripts/install-relay.sh',
            'source' => "{$target}/scripts/install-relay.sh",
            'sha256' => self::RELAY_SHA256,
            'size' => 100,
            'executable' => false,
        ];

        return (string) json_encode([
            'version' => self::VERSION,
            'hostProtocolVersion' => HostProtocolVersion::RemoteProject->value,
            'capabilities' => ReleaseManifest::REQUIRED_CAPABILITIES,
            'targets' => [
                ['os' => 'darwin', 'arch' => 'arm64', ...self::OFFERED, 'artifacts' => [$relay('darwin-arm64')]],
                ['os' => 'linux', 'arch' => 'amd64', ...self::OFFERED, 'artifacts' => [$relay('linux-amd64')]],
            ],
        ]);
    }
}
