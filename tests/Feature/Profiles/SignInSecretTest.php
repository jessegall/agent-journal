<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Support\ActorIdentity;
use App\Actors\Values\OwnerAuthority;
use App\Bus\Contracts\CommandBus;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\EntryDispatchers;
use App\Drivers\Enums\HookDriver;
use App\Profiles\Commands\CompleteSignIn;
use App\Profiles\Commands\SubmitSignInCode;
use App\Profiles\Enums\SignInMethod;
use App\Profiles\Enums\SignInState;
use App\Profiles\Exceptions\SignInCodeInvalid;
use App\Profiles\Models\Account;
use App\Profiles\Models\SignInAttempt;
use App\Profiles\Support\SignInChallenges;
use App\Profiles\Values\SignInIdentity;
use Carbon\CarbonImmutable;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
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

    private const array TABLES = [
        'users',
        'accounts',
        'active_accounts',
        'sign_in_attempts',
        'command_receipts',
        'links',
    ];

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
        $attempt = $this->attempt(HookDriver::ClaudeCode, SignInMethod::ApiKey, 'request-1');

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

        $cases = [['claude-code', 'key-1'], ['claude-code', 'key-1'], ['codex', 'key-1'], ['claude-code', 'key-2']];

        foreach ($cases as $index => [$driver, $key]) {
            $attempt = $this->attempt(HookDriver::from($driver), SignInMethod::ApiKey, "request-{$index}");
            $this->submit($attempt, $key);
            $fingerprints[] = $attempt->refresh()->fingerprint;
        }

        $this->assertSame($fingerprints[0], $fingerprints[1]);
        $this->assertCount(3, array_unique($fingerprints));
    }

    public function test_an_oauth_code_keeps_its_short_limit_and_a_control_character_is_refused_for_both(): void
    {
        $oauth = $this->attempt(HookDriver::ClaudeCode, SignInMethod::OAuth, 'request-1');
        $secret = $this->attempt(HookDriver::ClaudeCode, SignInMethod::ApiKey, 'request-2');

        $this->assertThrows(fn () => $this->submit($oauth, str_repeat('k', 3000)), SignInCodeInvalid::class);
        $this->assertThrows(fn () => $this->submit($oauth, "ab\u{0007}c"), SignInCodeInvalid::class);
        $this->assertThrows(fn () => $this->submit($secret, "ab\u{0007}c"), SignInCodeInvalid::class);
        $this->assertNull($oauth->refresh()->fingerprint);
    }

    public function test_a_pasted_error_message_is_refused_and_the_attempt_waits_for_the_real_code(): void
    {
        $challenges = $this->app->make(SignInChallenges::class);
        $pasted = "Error in event handler: TypeError: Cannot read properties of undefined (reading 'id')";
        $code = 'Ksaw83zu7MDwmacNrrJ8tHqQXm1P6Rs1n7KMTUjY2lKY1#DV0-PaIOKpbJKqe--nxwxE48';

        foreach ([SignInMethod::OAuth, SignInMethod::ProviderToken] as $index => $method) {
            $attempt = $this->attempt(HookDriver::ClaudeCode, $method, "request-{$index}");

            $this->assertThrows(
                fn () => $this->submit($attempt, $pasted),
                SignInCodeInvalid::class,
                'it has spaces. Paste the',
            );
            $this->assertNull($challenges->takeCode($attempt->id));
            $this->assertTrue($attempt->refresh()->isLive());
            $this->assertNotSame(SignInState::Checking, $attempt->state);

            $this->submit($attempt, $code);
            $this->assertSame($code, $challenges->takeCode($attempt->id));
            $this->assertSame(SignInState::Checking, $attempt->refresh()->state);
        }
    }

    public function test_key_accounts_are_named_for_their_method_and_the_same_key_is_already_added(): void
    {
        $this->app->instance(AccessSettings::class, new AccessSettings(TestIds::of(1)));
        User::factory()->create(['id' => TestIds::of(1)]);

        $first = $this->verifiedKey('request-1', 'key-1');
        $again = $this->verifiedKey('request-2', 'key-1');
        $this->verifiedKey('request-3', 'key-2');

        $labels = Account::query()->orderBy('created_at')->orderBy('id')->pluck('label')->all();
        $this->assertSame(['Claude Code API key', 'Claude Code API key (2)'], $labels);
        $this->assertSame(SignInState::AlreadyAdded, $again->refresh()->state);
        $this->assertSame(SignInState::Complete, $first->refresh()->state);
    }

    /**
     * A key attempt for Claude Code, given its key and verified by the host.
     */
    private function verifiedKey(string $requestKey, string $key): SignInAttempt
    {
        $attempt = SignInAttempt::create(
            ActorIdentity::of(ActorContext::forUser(TestIds::of(1))),
            HookDriver::ClaudeCode,
            SignInMethod::ApiKey,
            '/journal/accounts/'.$requestKey,
            $requestKey,
            CarbonImmutable::now()->addMinutes(10),
        );
        $this->submit($attempt, $key);
        $attempt->waitForUser();
        $this->app->make(EntryDispatchers::class)->runAsJournal(
            CommandEntry::HostControl,
            'test host',
            new CompleteSignIn($attempt->id, $attempt->refresh()->generation, SignInIdentity::unproved()),
        );

        return $attempt;
    }

    private function attempt(HookDriver $driver, SignInMethod $method, string $requestKey): SignInAttempt
    {
        return SignInAttempt::create(
            ActorIdentity::system(),
            $driver,
            $method,
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
