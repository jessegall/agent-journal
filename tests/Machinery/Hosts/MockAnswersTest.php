<?php

declare(strict_types=1);

namespace Tests\Machinery\Hosts;

use Illuminate\Support\Facades\Process;
use Symfony\Component\Process\InputStream;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\Hosts\TestHost;
use Tests\Support\Mocks\Answer;
use Tests\Support\Mocks\CodexMock;
use Tests\TestCase;

/**
 * The mocks of the real-host tests answer exactly what the real Claude Code and Codex printed when they were
 * recorded, with this environment's folders, so a test against a mock proves the journal's part.
 */
#[TestsMachinery(TestHost::class)]
final class MockAnswersTest extends TestCase
{
    private const string SCRIPTS = __DIR__.'/../../Support/Hosts/scripts';

    private const string RECORDINGS = __DIR__.'/../../../resources/recordings';

    public function test_the_claude_code_stand_in_prints_its_recorded_build_and_sign_in(): void
    {
        $installation = $this->installation('claude-code', '2.1.323', 'claude');

        $this->journal->assertResult(
            [
                $this->recorded('claude-code', '2.1.323', 'version', $installation),
                $this->recorded('claude-code', '2.1.323', 'auth-status', $installation),
            ],
            [
                $this->printed($installation, 'claude', ['--version']),
                $this->printed($installation, 'claude', ['auth', 'status', '--json']),
            ],
        );
    }

    public function test_the_codex_stand_in_prints_its_recorded_build_and_sign_in(): void
    {
        $installation = $this->installation('codex', '0.165.0', 'codex');

        $this->journal->assertResult(
            [
                $this->recorded('codex', '0.165.0', 'version', $installation),
                $this->recorded('codex', '0.165.0', 'login-status', $installation),
            ],
            [
                $this->printed($installation, 'codex', ['--version']),
                $this->printed($installation, 'codex', ['login', 'status']),
            ],
        );
    }

    public function test_the_codex_app_server_stand_in_answers_each_request_under_its_own_id(): void
    {
        $installation = $this->installation('codex', '0.165.0', 'codex');
        $mock = CodexMock::from('codex/0.165.0')
            ->expects('initialize', fn (Answer $answer) => $answer->replies('device-login'))
            ->expects('initialized', fn (Answer $answer) => $answer)
            ->expects('account/read', fn (Answer $answer) => $answer->replies('device-login'))
            ->expects('account/login/start', fn (Answer $answer) => $answer->replies('device-login'));
        mkdir("{$installation}/mocks", 0o700);
        file_put_contents("{$installation}/mocks/{$mock->scriptName()}", json_encode($mock, JSON_THROW_ON_ERROR));
        $written = [
            ['id' => 'journal.initialize', 'method' => 'initialize', 'params' => ['clientInfo' => ['name' => 'journal']]],
            ['method' => 'initialized'],
            ['id' => 'journal.account', 'method' => 'account/read', 'params' => []],
            ['id' => 7, 'method' => 'account/login/start', 'params' => ['type' => 'chatgptDeviceCode']],
        ];

        $ids = $this->answeredIds($installation, $written, 3);

        $this->journal->assertResult(['journal.initialize', 'journal.account', 7], $ids);
    }

    /**
     * The ids the app-server mock answers the lines under, its input held open, as the journal holds it, until the
     * count of answers came or ten seconds went by: a mock whose input ends cuts off the answers still under way.
     *
     * @param  list<array<string, mixed>>  $written
     * @return list<int|string>
     */
    private function answeredIds(string $installation, array $written, int $count): array
    {
        $input = new InputStream();
        $running = Process::env(['CODEX_HOME' => "{$installation}/home"])
            ->input($input)
            ->start(["{$installation}/bin/codex", 'app-server']);

        foreach ($written as $line) {
            $input->write(json_encode($line, JSON_THROW_ON_ERROR)."\n");
        }

        $deadline = microtime(true) + 10;

        while (count($this->idsIn($running->output())) < $count && microtime(true) < $deadline) {
            usleep(50_000);
        }

        $input->close();
        $running->wait();

        return $this->idsIn($running->output());
    }

    /**
     * @return list<int|string>
     */
    private function idsIn(string $printed): array
    {
        $answers = array_map(
            fn (string $line) => json_decode($line, true, flags: JSON_THROW_ON_ERROR),
            array_filter(explode("\n", $printed), fn (string $line) => str_starts_with($line, '{')),
        );

        return array_values(array_filter(array_map(fn (array $answer) => $answer['id'] ?? null, $answers)));
    }

    /**
     * An installation laid out as the test host lays it out, with the mock under the driver's program name and
     * the driver's recorded exchanges.
     */
    private function installation(string $driver, string $build, string $program): string
    {
        $installation = sys_get_temp_dir().'/mock-'.bin2hex(random_bytes(6));
        mkdir("{$installation}/bin", 0o700, true);
        mkdir("{$installation}/home", 0o700);
        mkdir("{$installation}/lib", 0o700);
        copy(self::SCRIPTS.'/lib/hold.sh', "{$installation}/lib/hold.sh");
        copy(self::SCRIPTS."/{$program}-mock.sh", "{$installation}/bin/{$program}");
        chmod("{$installation}/bin/{$program}", 0o700);
        symlink(TestHost::binary(), "{$installation}/bin/journal-agent");

        foreach (glob(self::RECORDINGS."/{$driver}/{$build}/exchanges/*/fixture.json") ?: [] as $fixture) {
            $folder = "{$installation}/exchanges/{$driver}/".basename(dirname($fixture));
            mkdir($folder, 0o700, true);
            copy($fixture, "{$folder}/fixture.json");
        }

        return $installation;
    }

    /**
     * What the mock prints for the arguments and the input, on either stream.
     *
     * @param  list<string>  $arguments
     */
    private function printed(string $installation, string $program, array $arguments, string $input = ''): string
    {
        $ran = Process::env(['CLAUDE_CONFIG_DIR' => "{$installation}/home", 'CODEX_HOME' => "{$installation}/home"])
            ->input($input)
            ->run(["{$installation}/bin/{$program}", ...$arguments])
            ->throw();

        return trim($ran->output().$ran->errorOutput());
    }

    /**
     * What the real program printed when it was recorded, on either stream, with this installation's folders.
     */
    private function recorded(string $driver, string $build, string $exchange, string $installation): string
    {
        $path = self::RECORDINGS."/{$driver}/{$build}/exchanges/{$exchange}/fixture.json";
        $fixture = json_decode((string) file_get_contents($path), true, flags: JSON_THROW_ON_ERROR);
        $printed = implode(
            '',
            array_map(fn (array $chunk) => (string) base64_decode($chunk['bytes'], true), $fixture['output']),
        );

        return trim(str_replace(['{env:CLAUDE_CONFIG_DIR}', '{env:CODEX_HOME}'], "{$installation}/home", $printed));
    }
}
