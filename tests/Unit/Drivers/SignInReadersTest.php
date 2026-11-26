<?php

declare(strict_types=1);

namespace Tests\Unit\Drivers;

use App\Accounts\Enums\SignInMethod;
use App\Agents\Drivers\ClaudeCode\ClaudeCodeSignInReader;
use App\Agents\Drivers\Codex\CodexSignInReader;
use App\Agents\Values\SignInFolder;
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
        $folder = new SignInFolder('/accounts/a7/', '/real/a7', false);

        $signedIn = $reader($this->claudeStatus('claude.ai', '/accounts/a7'), 0, $folder);
        $byRealPath = $reader($this->claudeStatus('oauth_token', '/real/a7'), 0, $folder);
        $elsewhere = $reader($this->claudeStatus('claude.ai', '/accounts/b8'), 0, $folder);
        $unknownMethod = $reader($this->claudeStatus('console', '/accounts/a7'), 0, $folder);
        $unreadable = $reader('not json', 1, $folder);

        $this->journal->assertResult(
            [true, 'owner@example.test', true, false, false, false, false],
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

    public function test_codex_tells_the_method_by_its_first_words_on_a_clean_exit_in_a_folder_with_its_sign_in(): void
    {
        $reader = new CodexSignInReader();
        $folder = new SignInFolder('/accounts/a7', '/accounts/a7', true);

        $chatGpt = $reader("Logged in using ChatGPT\n", 0, $folder);
        $key = $reader('API key configured', 0, $folder);
        $failed = $reader('Logged in using ChatGPT', 1, $folder);
        $noFile = $reader('Logged in using ChatGPT', 0, new SignInFolder('/accounts/a7', '/accounts/a7', false));
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
                $reader('Logged in using ChatGPT', null, SignInFolder::named(''))->isSignedIn,
            ],
        );
    }

    private function claudeStatus(string $method, string $folder): string
    {
        return json_encode([
            'loggedIn' => true,
            'authMethod' => $method,
            'configDirectory' => $folder,
            'email' => 'owner@example.test',
        ], JSON_THROW_ON_ERROR);
    }
}
