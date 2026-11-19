<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Profiles\Support\CodexSignIn;
use App\Profiles\Support\SignInProtocols;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Codex's own device-code sign-in run against a stand-in app-server: the account folder keeps its sign-in in its own
 * file before the sign-in starts, the address and code come from the program's answer, the sign-in is over when the
 * program announces it, and its own status check signs the folder in.
 */
#[TimeLimit(seconds: 4, reason: 'It runs a stand-in program as a host process.')]
final class CodexSignInTest extends TestCase
{
    private string $directory;

    protected function setUp(): void
    {
        parent::setUp();

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
        $this->assertStringContainsString('cli_auth_credentials_store = "file"', $config);
        $this->assertStringNotContainsString('keyring', $config);
        $this->assertStringContainsString('model = "x"', $config);
        $this->assertTrue($protocol->verify($this->directory)->isSignedIn);
    }

    public function test_an_empty_folder_is_not_signed_in_and_the_runner_finds_the_protocol(): void
    {
        $this->assertFalse($this->app->make(CodexSignIn::class)->verify($this->directory)->isSignedIn);
        $this->assertInstanceOf(CodexSignIn::class, $this->app->make(SignInProtocols::class)->for('codex'));
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
