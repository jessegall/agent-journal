<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Profiles\Exceptions\SignInCodeInvalid;
use App\Profiles\Support\ClaudeSignIn;
use App\Profiles\Support\PrivateAccountProcess;
use App\Profiles\Support\SignInProtocols;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Claude Code's own sign-in run against a stand-in program: the address comes from its private output, the user's
 * code is typed only when it is one clean line, and only the program's own check of this folder signs it in.
 */
#[TimeLimit(seconds: 4, reason: 'It runs a stand-in program as a host process several times.')]
final class ClaudeSignInTest extends TestCase
{
    private string $directory;

    protected function setUp(): void
    {
        parent::setUp();

        config(['accounts.claude_program' => base_path('tests/Fixtures/Accounts/Claude/fake/claude')]);
        $this->directory = sys_get_temp_dir().'/claude-sign-in-'.bin2hex(random_bytes(4));
        mkdir($this->directory, 0700);
    }

    protected function tearDown(): void
    {
        exec('rm -rf '.escapeshellarg($this->directory));
        parent::tearDown();
    }

    public function test_the_address_and_a_clean_code_sign_the_folder_in(): void
    {
        $protocol = $this->app->make(ClaudeSignIn::class);
        $process = $protocol->begin($this->directory);

        $this->assertStringStartsWith('https://claude.ai/oauth/authorize', $this->addressOf($protocol, $process));
        $protocol->submitCode($process, " ok \n");
        $process->finish();

        $verification = $protocol->verify($this->directory);
        $this->assertTrue($verification->isSignedIn);
        $this->assertSame('user@example.test', $verification->identity);
    }

    public function test_a_wrong_code_leaves_the_folder_signed_out_and_a_control_character_never_reaches_it(): void
    {
        $protocol = $this->app->make(ClaudeSignIn::class);
        $process = $protocol->begin($this->directory);

        try {
            $protocol->submitCode($process, "ok\u{0007}");
            $this->fail('A code with a control character was typed.');
        } catch (SignInCodeInvalid) {
            $protocol->submitCode($process, 'not-the-code');
        }

        $process->finish();
        $this->assertFalse($protocol->verify($this->directory)->isSignedIn);
    }

    public function test_the_runner_finds_the_claude_protocol(): void
    {
        $this->assertInstanceOf(ClaudeSignIn::class, $this->app->make(SignInProtocols::class)->for('claude-code'));
    }

    private function addressOf(ClaudeSignIn $protocol, PrivateAccountProcess $process): string
    {
        for ($try = 0; $try < 100; $try++) {
            $address = $protocol->addressFrom($process);

            if ($address !== null) {
                return $address;
            }

            usleep(20_000);
        }

        $this->fail('The program printed no address.');
    }
}
