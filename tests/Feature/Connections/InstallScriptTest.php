<?php

declare(strict_types=1);

namespace Tests\Feature\Connections;

use App\Exceptions\TicketMalformed;
use App\Support\InstallScript;
use App\Values\ReleaseManifest;
use App\Values\ReleaseTarget;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * The script an install line pipes into sh: it parses, holds the ticket once and runs nothing before its last line.
 */
#[TimeLimit(seconds: 30, reason: 'It runs sh on every cut of the rendered script.')]
final class InstallScriptTest extends TestCase
{
    private const string MAIN_START = 'main() {';

    private const string MAIN_CALL = 'main "$@"';

    private const string VERSION = '1.0.0';

    private const string TICKET = 'Tk3_x-9QvZ0aB1cD2eF3gH4iJ5kL6mN7';

    private const string RELAY_SHA256 = 'aa11bb22cc33dd44ee55ff66aa11bb22cc33dd44ee55ff66aa11bb22cc33dd44';

    /**
     * What each platform of the test release offers: its prerequisites and both local providers.
     */
    private const array OFFERED = [
        'prerequisites' => ['git', 'curl'],
        'providers' => ReleaseTarget::REQUIRED_PROVIDERS,
    ];

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

    public function test_the_ticket_is_in_the_script_exactly_once(): void
    {
        $this->assertSame(1, substr_count($this->rendered(), self::TICKET));
    }

    public function test_main_is_called_only_on_the_last_line(): void
    {
        $lines = explode("\n", rtrim($this->rendered(), "\n"));

        $this->assertSame(self::MAIN_CALL, end($lines));
        $calls = array_filter($lines, fn (string $line) => str_starts_with($line, 'main'));
        $this->assertSame([self::MAIN_START, self::MAIN_CALL], array_values($calls));
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

    private function rendered(): string
    {
        return $this->app->make(InstallScript::class)->render(self::TICKET);
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
            'capabilities' => ReleaseManifest::REQUIRED_CAPABILITIES,
            'targets' => [
                ['os' => 'darwin', 'arch' => 'arm64', ...self::OFFERED, 'artifacts' => [$relay('darwin-arm64')]],
                ['os' => 'linux', 'arch' => 'amd64', ...self::OFFERED, 'artifacts' => [$relay('linux-amd64')]],
            ],
        ]);
    }
}
