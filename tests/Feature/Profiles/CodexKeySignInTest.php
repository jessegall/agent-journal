<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Profiles\Support\CodexKeySignIn;
use App\Profiles\Values\SignInVerification;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Codex signed in by an API key against a stand-in program: the key reaches it only on standard input, the status
 * must say a key is configured and one request must be answered, and a ChatGPT login in the folder is the wrong method.
 */
#[TimeLimit(seconds: 6, reason: 'It runs a stand-in program as a host process several times.')]
final class CodexKeySignInTest extends TestCase
{
    private const string KEY_REFUSAL = 'unexpected status 401 Unauthorized: Incorrect API key provided: the key. '
        .'You can find your API key at https://platform.openai.com/account/api-keys.';

    private string $directory;

    protected function setUp(): void
    {
        parent::setUp();

        // The account folders of this test lie in the system's temporary folder, so the accounts root is that folder.
        config(['accounts.root' => sys_get_temp_dir()]);

        config(['accounts.codex_program' => base_path('tests/Fixtures/Accounts/Codex/fake/codex')]);
        $this->directory = sys_get_temp_dir().'/codex-key-'.bin2hex(random_bytes(4));
        mkdir($this->directory, 0700);
    }

    protected function tearDown(): void
    {
        exec('rm -rf '.escapeshellarg($this->directory));
        parent::tearDown();
    }

    public function test_a_taken_key_signs_in_with_no_display_text_and_signing_out_ends_it(): void
    {
        $protocol = $this->app->make(CodexKeySignIn::class);
        $verification = $this->proofOf('valid-key');

        $this->assertTrue($verification->isSignedIn);
        $this->assertNull($verification->identity->display);
        $protocol->signOut($this->directory);
        $this->assertFalse($protocol->verify($this->directory)->isSignedIn);
        $this->assertTrue($protocol->verify($this->directory)->isCertain);
    }

    public function test_a_key_the_provider_refuses_proves_nothing_and_keeps_its_reason_without_the_key(): void
    {
        $verification = $this->proofOf('sk-proj-revoked-key');

        $this->assertFalse($verification->isSignedIn);
        $this->assertSame(self::KEY_REFUSAL, $verification->refusal);
    }

    public function test_a_refused_key_or_a_chatgpt_login_proves_nothing(): void
    {
        $this->assertFalse($this->proofOf('revoked-key')->isSignedIn);

        exec('rm -rf '.escapeshellarg($this->directory).'/*');
        file_put_contents($this->directory.'/auth.json', '{"tokens":"chatgpt"}');
        $this->assertFalse($this->app->make(CodexKeySignIn::class)->verify($this->directory)->isSignedIn);
    }

    private function proofOf(string $key): SignInVerification
    {
        $protocol = $this->app->make(CodexKeySignIn::class);
        $process = $protocol->begin($this->directory);
        $protocol->acceptCode($process, $key);

        for ($try = 0; $try < 100 && ! $protocol->hasFinished($process); $try++) {
            usleep(20_000);
        }

        $verification = $protocol->prove($process, $this->directory);
        $this->assertStringNotContainsString($key, $process->output());
        $process->stop();

        return $verification;
    }
}
