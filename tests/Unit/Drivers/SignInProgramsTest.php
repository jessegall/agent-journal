<?php

declare(strict_types=1);

namespace Tests\Unit\Drivers;

use App\Agents\Drivers\DefaultDrivers;
use App\Values\SecretHandover;
use App\Values\SignInReport;
use Tests\TestCase;

/**
 * Pins what the sign-in runner runs for each program before its drivers move onto the driver setup (doc 137 revision
 * 3, step 9, run through the sign-in program since step 11): the argv, the environment it names and what it reads from each answer, for start, status, model check
 * and sign-out, recorded from a stand-in program the first time and compared on every run after.
 */
final class SignInProgramsTest extends TestCase
{
    private const string FIXTURE = __DIR__.'/../../Fixtures/Drivers/sign-in-programs.json';

    /**
     * The stand-in program: it writes each call's argv and the variables a program reads, then answers as the real
     * program would for that command.
     */
    private const string PROGRAM = <<<'SH'
        #!/bin/sh
        {
          printf 'argv:'; for word in "$@"; do printf ' [%s]' "$word"; done; printf '\n'
          printf 'HOME=%s\nCLAUDE_CONFIG_DIR=%s\nCODEX_HOME=%s\nPATH_FIRST=%s\n' "$HOME" "$CLAUDE_CONFIG_DIR" "$CODEX_HOME" "${PATH%%:*}"
        } >> "$HOME/calls"
        case "$1" in
          auth) printf '{"loggedIn":true,"authMethod":"claude.ai","configDirectory":"%s","email":"owner@example.test"}' "$HOME" ;;
          -p) printf '{"type":"result","is_error":false,"result":"OK"}' ;;
          exec) printf '{"type":"turn.completed"}\n' ;;
          login) printf 'Logged in using ChatGPT\n' ;;
        esac
        SH;

    private string $folder = '';

    protected function setUp(): void
    {
        parent::setUp();

        config(['accounts.root' => sys_get_temp_dir()]);
        $this->folder = sys_get_temp_dir().'/sign-in-programs-'.uniqid();
        mkdir($this->folder, 0o700);
        file_put_contents($this->folder.'/program', self::PROGRAM);
        chmod($this->folder.'/program', 0o700);
        config([
            'accounts.claude_program' => $this->folder.'/program',
            'accounts.codex_program' => $this->folder.'/program',
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
        $runs = [...$this->claudeRuns(), ...$this->codexRuns()];

        $this->assertSame($this->recorded($runs), $runs);
    }

    /**
     * @return array<string, mixed>
     */
    private function claudeRuns(): array
    {
        $claude = $this->journal->driverProfile(DefaultDrivers::CLAUDE_CODE)->signInProgram();
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
        $codex = $this->journal->driverProfile(DefaultDrivers::CODEX)->signInProgram();
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
     * The calls the stand-in program wrote since the last read, with the account folder named {folder}.
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

    /**
     * The recorded runs; the first run records today's and stops, so every later run compares against them.
     *
     * @param  array<string, mixed>  $runs
     * @return array<string, mixed>
     */
    private function recorded(array $runs): array
    {
        if (! is_file(self::FIXTURE)) {
            file_put_contents(self::FIXTURE, json_encode($runs, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)."\n");
            $this->markTestIncomplete('Recorded today\'s sign-in programs; run the test again to compare against them.');
        }

        return json_decode((string) file_get_contents(self::FIXTURE), true, flags: JSON_THROW_ON_ERROR);
    }
}
