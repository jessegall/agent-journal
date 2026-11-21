<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Profiles\Support\ClaudeKeySignIn;
use App\Profiles\Support\ClaudeSecretSignIn;
use App\Profiles\Support\ClaudeTokenSignIn;
use App\Profiles\Values\SignInVerification;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Claude Code signed in by a key or a provider token the owner gives, against a stand-in program: the value lands in
 * its own private file, the status must name the method, one model call must answer, and signing out removes the file.
 */
#[TimeLimit(seconds: 8, reason: 'It runs a stand-in program as a host process several times.')]
final class ClaudeSecretSignInTest extends TestCase
{
    private string $directory;

    protected function setUp(): void
    {
        parent::setUp();

        // The account folders of this test lie in the system's temporary folder, so the accounts root is that folder.
        config(['accounts.root' => sys_get_temp_dir()]);

        config(['accounts.claude_program' => base_path('tests/Fixtures/Accounts/Claude/fake/claude')]);
        $this->directory = sys_get_temp_dir().'/claude-secret-'.bin2hex(random_bytes(4));
        mkdir($this->directory, 0700);
    }

    protected function tearDown(): void
    {
        exec('rm -rf '.escapeshellarg($this->directory));
        parent::tearDown();
    }

    public function test_a_working_key_signs_in_by_its_method_and_its_file_is_private(): void
    {
        $verification = $this->proofOf(ClaudeKeySignIn::class, 'valid-key');

        $this->assertTrue($verification->isSignedIn);
        $this->assertNull($verification->identity->display);
        $this->assertSame('0600', substr(sprintf('%o', fileperms($this->directory.'/api-key')), -4));
    }

    public function test_a_working_token_signs_in_with_the_expiry_its_status_shows(): void
    {
        file_put_contents($this->directory.'/token-expires', '2027-05-01T00:00:00Z');

        $verification = $this->proofOf(ClaudeTokenSignIn::class, 'valid-token');

        $this->assertTrue($verification->isSignedIn);
        $this->assertSame('2027-05-01', $verification->identity->expiry()?->toDateString());
    }

    public function test_a_key_the_provider_refuses_keeps_the_providers_reason(): void
    {
        $verification = $this->proofOf(ClaudeKeySignIn::class, 'revoked-key');

        $this->assertFalse($verification->isSignedIn);
        $this->assertSame('Invalid API key · Fix external API key', $verification->refusal);
    }

    public function test_a_key_no_model_call_accepts_or_an_oauth_login_in_its_folder_proves_nothing(): void
    {
        $this->assertFalse($this->proofOf(ClaudeKeySignIn::class, 'revoked-key')->isSignedIn);

        exec('rm -rf '.escapeshellarg($this->directory).'/*');
        file_put_contents($this->directory.'/signed-in', 'user@example.test');

        $this->assertFalse($this->proofOf(ClaudeKeySignIn::class, 'valid-key')->isSignedIn);
    }

    public function test_signing_out_removes_the_value_so_the_folder_is_certainly_signed_out(): void
    {
        $protocol = $this->app->make(ClaudeKeySignIn::class);
        $this->proofOf(ClaudeKeySignIn::class, 'valid-key');

        $protocol->signOut($this->directory);

        $this->assertFileDoesNotExist($this->directory.'/api-key');
        $verification = $protocol->verify($this->directory);
        $this->assertTrue($verification->isCertain);
        $this->assertFalse($verification->isSignedIn);
    }

    /**
     * @param  class-string<ClaudeSecretSignIn>  $method
     */
    private function proofOf(string $method, string $value): SignInVerification
    {
        $protocol = $this->app->make($method);
        $process = $protocol->begin($this->directory);
        $this->assertNull($protocol->challengeFrom($process));
        $protocol->acceptCode($process, $value);

        for ($try = 0; $try < 100 && ! $protocol->hasFinished($process); $try++) {
            usleep(20_000);
        }

        $verification = $protocol->prove($process, $this->directory);
        $process->stop();

        return $verification;
    }
}
