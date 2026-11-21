<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Profiles\Exceptions\SignInCodeInvalid;
use App\Profiles\Support\ClaudeSignIn;
use App\Profiles\Support\PrivateAccountProcess;
use App\Profiles\Support\SignInProtocols;
use App\Profiles\Values\SignInVerification;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Claude Code's own sign-in run against a stand-in program: the address comes from its private output, the user's
 * code is typed only when it is one clean line, and only the program's own check of this folder signs it in.
 */
#[TimeLimit(seconds: 8, reason: 'It runs a stand-in program as a host process several times.')]
final class ClaudeSignInTest extends TestCase
{
    private string $directory;

    protected function setUp(): void
    {
        parent::setUp();

        // The account folders of this test lie in the system's temporary folder, so the accounts root is that folder.
        config(['accounts.root' => sys_get_temp_dir()]);

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
        $this->assertSame('user@example.test', $verification->identity->display);
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

    public function test_a_login_that_exited_cleanly_with_a_matching_claude_ai_status_proves_the_sign_in(): void
    {
        $verification = $this->proofAfterLogin('ok');

        $this->assertTrue($verification->isSignedIn);
        $this->assertSame('user@example.test', $verification->identity->display);
        $this->assertNull($verification->identity->subject);
    }

    public function test_a_failed_login_another_method_or_another_folder_proves_nothing(): void
    {
        $this->assertFalse($this->proofAfterLogin('exit-1')->isSignedIn);
        $this->assertFalse($this->proofAfterLogin('ok', ['auth-method' => 'api_key'])->isSignedIn);
        $this->assertFalse($this->proofAfterLogin('ok', ['config-directory' => '/elsewhere'])->isSignedIn);
        $this->assertFalse($this->proofAfterLogin('ok', ['config-directory' => ''])->isSignedIn);
    }

    public function test_the_runner_finds_the_claude_protocol(): void
    {
        $this->assertInstanceOf(ClaudeSignIn::class, $this->app->make(SignInProtocols::class)->for('claude-code'));
    }

    /**
     * The proof after a login with this code, with files in the folder that change what its status prints.
     *
     * @param  array<string, string>  $statusFiles
     */
    private function proofAfterLogin(string $code, array $statusFiles = []): SignInVerification
    {
        exec('rm -rf '.escapeshellarg($this->directory).'/*');
        $protocol = $this->app->make(ClaudeSignIn::class);
        $process = $protocol->begin($this->directory);
        $this->addressOf($protocol, $process);
        $protocol->submitCode($process, $code);
        $process->finish();

        foreach ($statusFiles as $name => $text) {
            file_put_contents("{$this->directory}/{$name}", $text);
        }

        return $protocol->prove($process, $this->directory);
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
