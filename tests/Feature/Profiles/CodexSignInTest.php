<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Contracts\Files\Files;
use App\Enums\SignInMethod;
use App\Enums\SignInOutcome;
use App\Exceptions\SignInChallengeUnreadable;
use App\Support\CodexSignIn;
use App\Support\LocalAccountFolders;
use App\Support\PrivateSignInProcesses;
use App\Support\SignInProtocols;
use App\Values\ClaimedSignIn;
use App\Values\SignInVerification;
use Tests\Fixtures\Profiles\RecordingSignInHost;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;
use TypeError;

/**
 * Codex's own device-code sign-in run against a stand-in app-server: the account folder keeps its sign-in in its own
 * file before the sign-in starts, the address and code come from the driver's answer, the sign-in is over when the
 * driver announces it, and its own status check signs the folder in.
 */
#[TimeLimit(seconds: 8, reason: 'It runs a stand-in program as a host process several times.')]
final class CodexSignInTest extends TestCase
{
    private const string STORE_SETTING = 'cli_auth_credentials_store = "file"';

    private const string MODEL_SETTING = 'model = "x"';

    private string $directory;

    protected function setUp(): void
    {
        parent::setUp();

        // The account folders of this test lie in the system's temporary folder, so the accounts root is that folder.
        config(['accounts.root' => sys_get_temp_dir()]);

        config(['accounts.codex_program' => base_path('tests/Fixtures/Accounts/Codex/fake/codex')]);
        $this->directory = sys_get_temp_dir().'/codex-sign-in-'.bin2hex(random_bytes(4));
        mkdir($this->directory, 0700);
        file_put_contents($this->directory.'/config.toml', "cli_auth_credentials_store = \"keyring\"\nmodel = \"x\"\n");
    }

    protected function tearDown(): void
    {
        exec('rm -rf '.escapeshellarg($this->directory));
        parent::tearDown();
    }

    public function test_a_device_code_sign_in_keeps_its_file_store_and_ends_signed_in(): void
    {
        $protocol = $this->app->make(CodexSignIn::class);
        $process = $protocol->begin($this->directory);

        $this->waitUntil(fn () => $protocol->hasFinished($process));
        $deviceCode = $protocol->deviceCodeFrom($process);
        $process->stop();

        $this->assertSame(['address' => 'https://auth.openai.com/codex/device', 'code' => 'ABCD-1234'], $deviceCode);
        $config = (string) file_get_contents($this->directory.'/config.toml');
        $this->assertStringContainsString(self::STORE_SETTING, $config);
        $this->assertStringNotContainsString('keyring', $config);
        $this->assertStringContainsString(self::MODEL_SETTING, $config);
        $this->assertTrue($protocol->verify($this->directory)->isSignedIn);
    }

    public function test_another_logins_completion_keeps_the_sign_in_waiting(): void
    {
        touch($this->directory.'/only-other-login');
        $protocol = $this->app->make(CodexSignIn::class);
        $process = $protocol->begin($this->directory);

        $this->waitUntil(fn () => str_contains($process->output(), 'login-0'));
        usleep(100_000);

        $this->assertFalse($protocol->hasFinished($process));
        $process->stop();
    }

    public function test_an_answer_without_a_device_code_fails_by_name_instead_of_waiting(): void
    {
        touch($this->directory.'/unreadable-login-start');
        $protocol = $this->app->make(CodexSignIn::class);
        $process = $protocol->begin($this->directory);
        $this->waitUntil(fn () => str_contains($process->output(), 'login-1'));

        try {
            $this->expectException(SignInChallengeUnreadable::class);
            $protocol->deviceCodeFrom($process);
        } finally {
            $process->stop();
        }
    }

    public function test_the_runner_ends_a_sign_in_without_a_device_code_at_once_with_its_reason(): void
    {
        touch($this->directory.'/unreadable-login-start');
        $deadline = '2099-01-01T00:00:00+00:00';
        $claimed = new ClaimedSignIn('attempt-1', 'codex', SignInMethod::OAuth, $this->directory, 0, $deadline, null);
        $host = new RecordingSignInHost($claimed);
        $files = $this->app->make(Files::class);
        $protocols = $this->app->make(SignInProtocols::class);
        $pause = static fn () => usleep(10_000);

        new PrivateSignInProcesses($host, $protocols, $pause, $files, new LocalAccountFolders($files))->runNext();

        $this->assertSame(SignInOutcome::Interrupted, end($host->outcomes));
        $reason = SignInChallengeUnreadable::fromLoginStart(new TypeError())->getMessage();
        $this->assertSame($reason, end($host->refusals));
    }

    public function test_its_own_successful_login_and_a_chatgpt_account_prove_the_sign_in(): void
    {
        $verification = $this->proof();

        $this->assertTrue($verification->isSignedIn);
        $this->assertSame('user@example.test', $verification->identity->display);
        $this->assertNull($verification->identity->subject);
    }

    public function test_a_failed_login_another_account_type_or_no_account_answer_proves_nothing(): void
    {
        foreach (['login-fails' => '', 'account-type' => 'apiKey', 'no-account-read' => ''] as $file => $text) {
            $earlier = array_map(
                fn (string $name) => "{$this->directory}/{$name}",
                ['login-fails', 'account-type', 'no-account-read', 'auth.json'],
            );
            array_map(unlink(...), array_filter($earlier, is_file(...)));

            file_put_contents("{$this->directory}/{$file}", $text);

            $this->assertFalse($this->proof()->isSignedIn, $file);
        }
    }

    public function test_an_empty_folder_is_not_signed_in_and_the_runner_finds_the_protocol(): void
    {
        $this->assertFalse($this->app->make(CodexSignIn::class)->verify($this->directory)->isSignedIn);
        $this->assertInstanceOf(CodexSignIn::class, $this->app->make(SignInProtocols::class)->for('codex'));
    }

    private function proof(): SignInVerification
    {
        $protocol = $this->app->make(CodexSignIn::class);
        $process = $protocol->begin($this->directory);
        $this->waitUntil(fn () => $protocol->hasFinished($process));
        $verification = $protocol->prove($process, $this->directory);
        $process->stop();

        return $verification;
    }

    private function waitUntil(callable $isDone): void
    {
        for ($try = 0; $try < 150; $try++) {
            if ($isDone()) {
                return;
            }

            usleep(20_000);
        }

        $this->fail('The sign-in never finished.');
    }
}
