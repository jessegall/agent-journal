<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Commands\Accounts\CompleteSignIn\CompleteSignInCommand;
use App\Commands\Accounts\SubmitSignInCode\SubmitSignInCodeCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Enums\Accounts\CommandEntry;
use App\Enums\Accounts\SignInMethod;
use App\Enums\Accounts\SignInState;
use App\Exceptions\SignInAnswerRefused;
use App\Exceptions\SignInCodeInvalid;
use App\Models\Accounts\Account;
use App\Models\Accounts\SignInAttempt;
use App\Support\ActorContext;
use App\Support\ActorIdentity;
use App\Support\DefaultDrivers;
use App\Support\EntryDispatchers;
use App\Support\SignInChallenges;
use App\Values\OwnerAuthority;
use App\Values\SignInIdentity;
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
 * only a keyed fingerprint on the attempt; the same key for the same driver is known again by it.
 */
#[TimeLimit(seconds: 3, reason: 'It commits attempts through the bus and empties three tables per test.')]
final class SignInSecretTest extends TestCase
{
    use CommitsHookRows;

    private const string PASTE_ADVICE = 'it has spaces. Paste the';

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
        $attempt = $this->attempt(DefaultDrivers::CLAUDE_CODE, SignInMethod::ApiKey, 'request-1');

        $this->submit($attempt, " {$key} ");

        $challenges = $this->app->make(SignInChallenges::class);
        $this->assertSame($key, $challenges->takeCode($attempt->refresh()));
        $this->assertNull($challenges->takeCode($attempt->refresh()));
        $row = (string) json_encode(DB::table('sign_in_attempts')->where('id', $attempt->id)->sole());
        $this->assertStringNotContainsString($key, $row);
        $this->assertSame(64, strlen((string) $attempt->refresh()->fingerprint));
    }

    public function test_the_same_key_and_program_give_the_same_fingerprint_and_others_another(): void
    {
        $fingerprints = [];

        $cases = [['claude-code', 'key-1'], ['claude-code', 'key-1'], ['codex', 'key-1'], ['claude-code', 'key-2']];

        foreach ($cases as $index => [$driver, $key]) {
            $attempt = $this->attempt($driver, SignInMethod::ApiKey, "request-{$index}");
            $this->submit($attempt, $key);
            $fingerprints[] = $attempt->refresh()->fingerprint;
        }

        $this->assertSame($fingerprints[0], $fingerprints[1]);
        $this->assertCount(3, array_unique($fingerprints));
    }

    public function test_an_oauth_code_keeps_its_short_limit_and_a_control_character_is_refused_for_both(): void
    {
        $oauth = $this->attempt(DefaultDrivers::CLAUDE_CODE, SignInMethod::OAuth, 'request-1');
        $secret = $this->attempt(DefaultDrivers::CLAUDE_CODE, SignInMethod::ApiKey, 'request-2');

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
            $attempt = $this->attempt(DefaultDrivers::CLAUDE_CODE, $method, "request-{$index}");

            $this->assertThrows(
                fn () => $this->submit($attempt, $pasted),
                SignInCodeInvalid::class,
                self::PASTE_ADVICE,
            );
            $this->assertNull($challenges->takeCode($attempt->refresh()));
            $this->assertTrue($attempt->refresh()->isLive());
            $this->assertNotSame(SignInState::Checking, $attempt->state);

            $this->submit($attempt, $code);
            $this->assertSame($code, $challenges->takeCode($attempt->refresh()));
            $this->assertSame(SignInState::Checking, $attempt->refresh()->state);
        }
    }

    public function test_an_answer_is_taken_only_while_the_attempt_waits_and_a_repeat_is_its_first_receipt(): void
    {
        $challenges = $this->app->make(SignInChallenges::class);
        $attempt = $this->attempt(DefaultDrivers::CLAUDE_CODE, SignInMethod::OAuth, 'request-1');
        $answer = fn (string $code, string $key) => $this->app->make(CommandBus::class)
            ->run(new SubmitSignInCodeCommand($attempt->id, $code, $key));

        $this->assertThrows(fn () => $answer('1234', 'answer-1'), SignInAnswerRefused::class);
        $attempt->refresh()->waitForUser();
        $answer('1234', 'answer-1');
        $answer('9999', 'answer-1');

        $this->assertSame('1234', $challenges->takeCode($attempt->refresh()));
        $this->assertNull($challenges->takeCode($attempt->refresh()));
        $this->assertSame(SignInState::Checking, $attempt->refresh()->state);
        $this->assertThrows(fn () => $answer('5678', 'answer-2'), SignInAnswerRefused::class);
    }

    public function test_a_code_is_bounded_in_bytes_and_a_codex_device_sign_in_takes_no_answer(): void
    {
        $oauth = $this->attempt(DefaultDrivers::CLAUDE_CODE, SignInMethod::OAuth, 'request-1');
        $device = $this->attempt(DefaultDrivers::CODEX, SignInMethod::OAuth, 'request-2');

        $this->assertThrows(fn () => $this->submit($oauth, str_repeat('a', 513)), SignInCodeInvalid::class);
        $this->assertThrows(fn () => $this->submit($oauth, str_repeat('é', 257)), SignInCodeInvalid::class);
        $this->assertSame(SignInState::Waiting, $oauth->refresh()->state);
        $this->assertThrows(fn () => $this->submit($device, '1234'), SignInAnswerRefused::class);
        $this->assertSame(SignInState::Waiting, $device->refresh()->state);
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
            DefaultDrivers::CLAUDE_CODE,
            SignInMethod::ApiKey,
            '/journal/accounts/'.$requestKey,
            CarbonImmutable::now()->addMinutes(10),
        );
        $this->submit($attempt, $key);
        $attempt->waitForUser();
        $this->app->make(EntryDispatchers::class)->runAsJournal(
            CommandEntry::HostControl,
            'test host',
            new CompleteSignInCommand($attempt->id, $attempt->refresh()->generation, SignInIdentity::unproved()),
        );

        return $attempt;
    }

    private function attempt(string $driver, SignInMethod $method, string $requestKey): SignInAttempt
    {
        return SignInAttempt::create(
            ActorIdentity::system(),
            $driver,
            $method,
            '/journal/accounts/'.$requestKey,
            CarbonImmutable::now()->addMinutes(10),
        );
    }

    private function submit(SignInAttempt $attempt, string $text): void
    {
        $attempt->waitForUser();
        $this->app->make(CommandBus::class)->run(new SubmitSignInCodeCommand($attempt->id, $text, 'answer-'.bin2hex(random_bytes(4))));
    }
}
