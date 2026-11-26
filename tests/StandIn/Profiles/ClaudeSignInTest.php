<?php

declare(strict_types=1);

namespace Tests\StandIn\Profiles;

use App\Exceptions\SignInCodeInvalid;
use App\Support\ClaudeSignIn;
use App\Support\ContainerManifest;
use App\Support\PrivateAccountProcess;
use App\Support\SignInProtocols;
use App\Values\SignInVerification;
use stdClass;
use Tests\Support\Entries\Attributes\TestsAgainstStandIn;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Claude Code's own sign-in run against a stand-in program: the address comes from its private output, the user's
 * code is typed only when it is one clean line, and only the driver's own check of this folder signs it in.
 */
#[TimeLimit(seconds: 8, reason: 'It runs a stand-in program as a host process several times.')]
#[TestsAgainstStandIn]
final class ClaudeSignInTest extends TestCase
{
    private const string OTHER_FOLDER = '/other';

    private const string STATE_BEFORE = '{"numStartups":7,"cachedGrowthBookFeatures":{},"projects":{"/other":{"hasTrustDialogAccepted":true}}}';

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

    /**
     * A signed-in folder is left past Claude Code's welcome screens and its trust question for the folder a
     * session works in, and what Claude Code keeps beside them stays as it wrote it, empty objects included.
     */
    public function test_a_folder_is_left_past_the_first_run_questions_and_keeps_what_claude_code_wrote(): void
    {
        $state = "{$this->directory}/.claude.json";
        file_put_contents($state, self::STATE_BEFORE);
        $protocol = $this->app->make(ClaudeSignIn::class);

        $protocol->settleFirstRun($this->directory);
        $settled = json_decode((string) file_get_contents($state), flags: JSON_THROW_ON_ERROR);
        $protocol->settleFirstRun($this->directory);

        $this->assertTrue($settled->hasCompletedOnboarding);
        $this->assertTrue($settled->projects->{ContainerManifest::WORKDIR}->hasTrustDialogAccepted);
        $this->assertSame(7, $settled->numStartups);
        $this->assertEquals(new stdClass(), $settled->cachedGrowthBookFeatures);
        $this->assertTrue($settled->projects->{self::OTHER_FOLDER}->hasTrustDialogAccepted);
        $this->assertJsonStringEqualsJsonString(json_encode($settled, JSON_THROW_ON_ERROR), (string) file_get_contents($state));
    }

    public function test_a_folder_claude_code_has_not_written_to_yet_is_settled_too(): void
    {
        $this->app->make(ClaudeSignIn::class)->settleFirstRun($this->directory);

        $settled = json_decode((string) file_get_contents("{$this->directory}/.claude.json"), flags: JSON_THROW_ON_ERROR);
        $this->assertTrue($settled->hasCompletedOnboarding);
        $this->assertTrue($settled->projects->{ContainerManifest::WORKDIR}->hasTrustDialogAccepted);
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

        $this->fail('The driver printed no address.');
    }
}
