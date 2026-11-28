<?php

declare(strict_types=1);

namespace Tests\Unit\Drivers;

use App\Accounts\Enums\SignInMethod;
use App\Agents\Drivers\ClaudeCode\ClaudeCodeSignInReader;
use App\Agents\Drivers\Codex\CodexSignInReader;
use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Exceptions\ProbeOutputRefused;
use App\Agents\Values\SignInFolder;
use App\Support\Recordings\Recordings;
use Tests\Support\Recordings\RecordedProgram;
use Tests\TestCase;

/**
 * Each driver's sign-in reader keeps today's rules: Claude Code is signed in by an accepted method in this folder, by
 * its path or real path; Codex by the words its status starts with, on a clean exit, in a folder that keeps its sign-in,
 * and the host probe, which has no exit code, by any sign-in it names.
 */
final class SignInReadersTest extends TestCase
{
    public function test_claude_code_is_signed_in_only_by_an_accepted_method_in_this_folder(): void
    {
        $reader = new ClaudeCodeSignInReader();
        $recordings = $this->journal->service(Recordings::class);
        $status = RecordedProgram::from(
            $recordings->scenario(DefaultDrivers::CLAUDE_CODE, 'first-start'),
            ['claude', 'auth', 'status', '--json'],
        );
        $printed = $status->printedOn('stdout');
        $recordedFolder = json_decode($printed, true, flags: JSON_THROW_ON_ERROR)['configDirectory'];
        $folder = new SignInFolder($recordedFolder.'/', '/real/a7', false);

        $signedIn = $reader($printed, $status->exitCode(), $folder);
        $byRealPath = $reader(
            str_replace(['claude.ai', $recordedFolder], ['oauth_token', '/real/a7'], $printed),
            $status->exitCode(),
            $folder,
        );
        $elsewhere = $reader($printed, $status->exitCode(), SignInFolder::named('/accounts/b8'));
        $unknownMethod = $reader(str_replace('claude.ai', 'console', $printed), $status->exitCode(), $folder);
        $unreadable = $reader('not json', 1, $folder);

        $this->journal->assertResult(
            [true, 'user@example.com', true, false, false, false, false],
            [
                $signedIn->isSignedInBy(SignInMethod::OAuth),
                $signedIn->email,
                $byRealPath->isSignedInBy(SignInMethod::ProviderToken),
                $elsewhere->isSignedIn,
                $unknownMethod->isSignedIn,
                $unreadable->isReadable,
                $unreadable->isSignedIn,
            ],
        );
    }

    public function test_a_line_printed_before_the_claude_code_status_refuses_the_probe_naming_the_line(): void
    {
        $recordings = $this->journal->service(Recordings::class);
        $status = RecordedProgram::from(
            $recordings->scenario(DefaultDrivers::CLAUDE_CODE, 'first-start'),
            ['claude', 'auth', 'status', '--json'],
        );

        $this->expectExceptionObject(ProbeOutputRefused::before('journal-init: ready'));

        (new ClaudeCodeSignInReader())(
            "journal-init: ready\n".$status->printedOn('stdout'),
            $status->exitCode(),
            SignInFolder::named('/accounts/a7'),
        );
    }

    public function test_codex_notifies_the_method_by_its_first_words_on_a_clean_exit_in_a_folder_with_its_sign_in(): void
    {
        $reader = new CodexSignInReader();
        $folder = new SignInFolder('/accounts/a7', '/accounts/a7', true);
        $status = $this->codexStatus();
        $printed = $status->printedOn('stderr');

        $chatGpt = $reader($printed, $status->exitCode(), $folder);
        $key = $reader('API key configured', 0, $folder);
        $failed = $reader($printed, 1, $folder);
        $noFile = $reader($printed, $status->exitCode(), new SignInFolder('/accounts/a7', '/accounts/a7', false));
        $crashed = $reader('', 2, $folder);

        $this->journal->assertResult(
            [true, true, false, true, false, false],
            [
                $chatGpt->isSignedInBy(SignInMethod::OAuth),
                $key->isSignedInBy(SignInMethod::ApiKey),
                $failed->isSignedIn,
                $failed->isReadable,
                $noFile->isSignedIn,
                $crashed->isReadable,
            ],
        );
    }

    public function test_the_host_probe_accepts_any_codex_sign_in_for_a_named_folder(): void
    {
        $reader = new CodexSignInReader();

        $this->journal->assertResult(
            [true, false, false],
            [
                $reader('Logged in using an API key', null, SignInFolder::named('/accounts/a7'))->isSignedIn,
                $reader('Not logged in', null, SignInFolder::named('/accounts/a7'))->isSignedIn,
                $reader($this->codexStatus()->printedOn('stderr'), null, SignInFolder::named(''))->isSignedIn,
            ],
        );
    }

    private function codexStatus(): RecordedProgram
    {
        return RecordedProgram::from(
            $this->journal->service(Recordings::class)->scenario(DefaultDrivers::CODEX, 'first-start'),
            ['codex', 'login', 'status'],
        );
    }
}
