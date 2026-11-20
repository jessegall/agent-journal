<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Support\ActorIdentity;
use App\Actors\Values\OwnerAuthority;
use App\Bus\Contracts\CommandBus;
use App\Profiles\Commands\SubmitSignInCode;
use App\Profiles\Enums\SignInMethod;
use App\Profiles\Exceptions\SignInCodeInvalid;
use App\Profiles\Models\SignInAttempt;
use App\Profiles\Support\SignInChallenges;
use App\Profiles\Values\AccountLabel;
use App\Programs\Enums\HookProgram;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A key or token for a secret method travels to the host like a typed code, up to its own longer limit, and leaves
 * only a keyed fingerprint on the attempt; the same key for the same program is known again by it.
 */
#[TimeLimit(seconds: 3, reason: 'It commits attempts through the bus and empties three tables per test.')]
final class SignInSecretTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['sign_in_attempts', 'command_receipts', 'links'];

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(1)),
            new OwnerAuthority('test'),
        );
    }

    public function test_a_long_key_reaches_the_host_once_and_only_its_fingerprint_is_saved(): void
    {
        $key = str_repeat('k', 3000);
        $attempt = $this->attempt(HookProgram::ClaudeCode, SignInMethod::ApiKey, 'request-1');

        $this->submit($attempt, " {$key} ");

        $challenges = $this->app->make(SignInChallenges::class);
        $this->assertSame($key, $challenges->takeCode($attempt->id));
        $this->assertNull($challenges->takeCode($attempt->id));
        $row = (string) json_encode(DB::table('sign_in_attempts')->where('id', $attempt->id)->sole());
        $this->assertStringNotContainsString($key, $row);
        $this->assertSame(64, strlen((string) $attempt->refresh()->fingerprint));
    }

    public function test_the_same_key_and_program_give_the_same_fingerprint_and_others_another(): void
    {
        $fingerprints = [];

        foreach ([['claude-code', 'key-1'], ['claude-code', 'key-1'], ['codex', 'key-1'], ['claude-code', 'key-2']] as $index => [$program, $key]) {
            $attempt = $this->attempt(HookProgram::from($program), SignInMethod::ApiKey, "request-{$index}");
            $this->submit($attempt, $key);
            $fingerprints[] = $attempt->refresh()->fingerprint;
        }

        $this->assertSame($fingerprints[0], $fingerprints[1]);
        $this->assertCount(3, array_unique($fingerprints));
    }

    public function test_an_oauth_code_keeps_its_short_limit_and_a_control_character_is_refused_for_both(): void
    {
        $oauth = $this->attempt(HookProgram::ClaudeCode, SignInMethod::OAuth, 'request-1');
        $secret = $this->attempt(HookProgram::ClaudeCode, SignInMethod::ApiKey, 'request-2');

        $this->assertThrows(fn () => $this->submit($oauth, str_repeat('k', 3000)), SignInCodeInvalid::class);
        $this->assertThrows(fn () => $this->submit($oauth, "ab\u{0007}c"), SignInCodeInvalid::class);
        $this->assertThrows(fn () => $this->submit($secret, "ab\u{0007}c"), SignInCodeInvalid::class);
        $this->assertNull($oauth->refresh()->fingerprint);
    }

    private function attempt(HookProgram $program, SignInMethod $method, string $requestKey): SignInAttempt
    {
        return SignInAttempt::forNewAccount(
            ActorIdentity::system(),
            $program,
            $method,
            AccountLabel::from('Work'),
            '/journal/accounts/'.$requestKey,
            $requestKey,
            CarbonImmutable::now()->addMinutes(10),
        );
    }

    private function submit(SignInAttempt $attempt, string $text): void
    {
        $this->app->make(CommandBus::class)->run(new SubmitSignInCode($attempt->id, $text));
    }
}
