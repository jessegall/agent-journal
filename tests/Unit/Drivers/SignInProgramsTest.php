<?php

declare(strict_types=1);

namespace Tests\Unit\Drivers;

use App\Accounts\Data\ClaudeStatusData;
use App\Accounts\Enums\SignInMethod;
use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Values\SecretHandover;
use App\Agents\Values\SignInReport;
use App\Files\Contracts\Files;
use App\Files\Enums\Place;
use App\Support\Recordings\Recordings;
use Tests\Support\Recordings\RecordedProgram;
use Tests\TestCase;

/**
 * Pins what the sign-in runner runs for each driver: the argv, the environment it names and what it reads from each
 * answer, for start, status, model check and sign-out.
 */
final class SignInProgramsTest extends TestCase
{
    /**
     * The mock program: it writes each call's argv and the variables a program reads, then answers as the real
     * program would for that command.
     */
    private const string PROGRAM = <<<'SH'
        #!/bin/sh
        {
          printf 'argv:'; for word in "$@"; do printf ' [%s]' "$word"; done; printf '\n'
          printf 'HOME=%s\nCLAUDE_CONFIG_DIR=%s\nCODEX_HOME=%s\nPATH_FIRST=%s\n' "$HOME" "$CLAUDE_CONFIG_DIR" "$CODEX_HOME" "${PATH%%:*}"
        } >> "$HOME/calls"
        case "$1" in
          auth|-p|exec|login) cat "$HOME/$1.out" ;;
          --version)
            if [ -n "$CLAUDE_CONFIG_DIR" ]; then
              cat "$HOME/claude-version.out"
            else
              cat "$HOME/codex-version.out"
            fi
            ;;
        esac
        SH;

    private string $folder = '';

    protected function setUp(): void
    {
        parent::setUp();

        config(['journal.accounts.root' => sys_get_temp_dir()]);
        $this->folder = sys_get_temp_dir().'/sign-in-programs-'.uniqid();
        mkdir($this->folder, 0o700);
        file_put_contents($this->folder.'/program', self::PROGRAM);
        chmod($this->folder.'/program', 0o700);
        $this->arrangeProgramOutput();
        config([
            'journal.accounts.claude_program' => $this->folder.'/program',
            'journal.accounts.codex_program' => $this->folder.'/program',
        ]);
    }

    protected function tearDown(): void
    {
        array_map(unlink(...), glob($this->folder.'/*') ?: []);
        rmdir($this->folder);

        parent::tearDown();
    }

    public function test_every_sign_in_program_runs_as_recorded(): void
    {
        $claude = $this->claudeRuns();
        $codex = $this->codexRuns();

        $this->assertSame([
            'claude start' => ['calls' => $this->claudeCalls('[--version]')],
            'claude status' => [
                'calls' => $this->claudeCalls('[auth] [status] [--json]'),
                'answer' => $this->recordedClaudeStatus(),
            ],
            'claude model check' => [
                'calls' => $this->claudeCalls(
                    '[-p] [Reply with OK.] [--output-format] [json] [--max-turns] [1] [--tools] []',
                    '[--no-session-persistence]',
                ),
                'answer' => null,
            ],
        ], $claude);
        $this->assertSame([
            'codex start' => [
                'calls' => $this->codexCalls('[--version]'),
                'config.toml' => 'cli_auth_credentials_store = "file"'.PHP_EOL,
            ],
            'codex status' => [
                'calls' => $this->codexCalls('[login] [status]'),
                'answer' => $this->reportOf(new SignInReport(true, false, null)),
            ],
            'codex model check' => [
                'calls' => $this->codexCalls('[exec] [--json] [--skip-git-repo-check] [Reply with OK.]'),
                'answer' => null,
            ],
            'codex sign-out' => ['calls' => $this->codexCalls('[logout]')],
        ], $codex);
    }

    private function arrangeProgramOutput(): void
    {
        $recordings = $this->journal->service(Recordings::class);
        $codex = $recordings->scenario(DefaultDrivers::CODEX, 'first-start');
        $auth = $this->claudeStatusOutput($recordings);
        $claudeTurn = RecordedProgram::from(
            $recordings->scenario(DefaultDrivers::CLAUDE_CODE, 'headless-turn'),
            ['claude', '--settings'],
        );
        $result = array_find(
            explode("\n", $claudeTurn->printedOn('stdout')),
            fn (string $line) => (json_decode($line, true)['type'] ?? '') === 'result',
        );
        $this->assertIsString($result);
        $codexTurn = RecordedProgram::from(
            $recordings->scenario(DefaultDrivers::CODEX, 'headless-turn'),
            ['codex', 'exec', '--json'],
        );

        $files = $this->journal->service(Files::class);
        $folder = $files->pathIn(Place::Temporary, $this->folder);
        $files->write($folder->child('auth.out'), str_replace('/home/journal/.account', $this->folder, $auth));
        $files->write($folder->child('-p.out'), $result);
        $files->write($folder->child('exec.out'), $codexTurn->printedOn('stdout'));
        $login = RecordedProgram::from($codex, ['codex', 'login', 'status'])->printedOn('stderr');
        $files->write($folder->child('login.out'), $login);

        $claudeVersion = RecordedProgram::versionOf($recordings, DefaultDrivers::CLAUDE_CODE, 'claude');
        $codexVersion = RecordedProgram::versionOf($recordings, DefaultDrivers::CODEX, 'codex');
        $files->write($folder->child('claude-version.out'), $claudeVersion);
        $files->write($folder->child('codex-version.out'), $codexVersion);
    }

    /**
     * @return array<string, mixed>
     */
    private function claudeRuns(): array
    {
        $claude = $this->journal->driverProfile(DefaultDrivers::CLAUDE_CODE)->signInDriver();
        $claude->start(['--version'], $this->folder, SecretHandover::none())->finish();
        $start = $this->calls();
        $status = $claude->status($this->folder, SecretHandover::none());
        $statusCalls = $this->calls();
        $refusal = $claude->modelRefusal($this->folder, SecretHandover::none());

        return [
            'claude start' => ['calls' => $start],
            'claude status' => [
                'calls' => $statusCalls,
                'answer' => $this->reportOf($status),
            ],
            'claude model check' => [
                'calls' => $this->calls(),
                'answer' => $refusal,
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function codexRuns(): array
    {
        $codex = $this->journal->driverProfile(DefaultDrivers::CODEX)->signInDriver();
        $codex->start(['--version'], $this->folder, SecretHandover::none())->finish();
        $start = ['calls' => $this->calls(), 'config.toml' => (string) file_get_contents($this->folder.'/config.toml')];
        $status = $codex->status($this->folder, SecretHandover::none());
        $statusCalls = $this->calls();
        $refusal = $codex->modelRefusal($this->folder, SecretHandover::none());
        $refusalCalls = $this->calls();
        $codex->signOut($this->folder);

        return [
            'codex start' => $start,
            'codex status' => [
                'calls' => $statusCalls,
                'answer' => $this->reportOf($status),
            ],
            'codex model check' => [
                'calls' => $refusalCalls,
                'answer' => $refusal,
            ],
            'codex sign-out' => ['calls' => $this->calls()],
        ];
    }

    /**
     * The calls the mock program wrote since the last read, with the account folder named {folder}.
     *
     * @return list<string>
     */
    private function calls(): array
    {
        $file = $this->folder.'/calls';
        $calls = file($file, FILE_IGNORE_NEW_LINES) ?: [];
        unlink($file);

        return array_map(
            fn (string $line): string => str_replace([$this->folder, base_path()], ['{folder}', '{base}'], $line),
            $calls,
        );
    }

    /**
     * @return array<string, mixed>
     */
    private function reportOf(SignInReport $report): array
    {
        return [
            ...get_object_vars($report),
            'method' => $report->method?->value,
        ];
    }

    private function claudeStatusOutput(Recordings $recordings): string
    {
        $scenario = $recordings->scenario(DefaultDrivers::CLAUDE_CODE, 'first-start');

        return RecordedProgram::from($scenario, ['claude', 'auth', 'status'])->printedOn('stdout');
    }

    /** @return array<string, mixed> */
    private function recordedClaudeStatus(): array
    {
        $printed = $this->claudeStatusOutput($this->journal->service(Recordings::class));
        $status = ClaudeStatusData::from(json_decode($printed, true, flags: JSON_THROW_ON_ERROR));

        return $this->reportOf(new SignInReport(
            true,
            true,
            SignInMethod::OAuth,
            $status->email,
            $status->loginExpiresAt,
            $status->organization,
        ));
    }

    /** @return list<string> */
    private function claudeCalls(string ...$arguments): array
    {
        return [
            'argv: '.implode(' ', $arguments),
            'HOME={folder}',
            'CLAUDE_CONFIG_DIR={folder}',
            'CODEX_HOME=',
            'PATH_FIRST={base}/programs/accounts/no-keychain',
        ];
    }

    /** @return list<string> */
    private function codexCalls(string $arguments): array
    {
        return [
            "argv: {$arguments}",
            'HOME={folder}',
            'CLAUDE_CONFIG_DIR=',
            'CODEX_HOME={folder}',
            'PATH_FIRST={base}/vendor/bin',
        ];
    }
}
