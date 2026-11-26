<?php

declare(strict_types=1);

namespace Tests\Commands\Accounts;

use App\Access\Values\OwnerAuthority;
use App\Accounts\Commands\SubmitSignInCode\SubmitSignInCodeCommand;
use App\Accounts\Enums\SignInMethod;
use App\Accounts\Enums\SignInStatus;
use App\Accounts\Exceptions\SignInAnswerRefused;
use App\Accounts\SignInChallenges;
use App\Actors\Contracts\CurrentActorSetter;
use App\Agents\Drivers\DefaultDrivers;
use App\Bus\Contracts\CommandBus;
use App\Exceptions\SignInCodeInvalid;
use App\Models\Accounts\SignInAttempt;
use App\Support\ActorReference;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TestIds;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * The owner submits a code or key for a waiting sign-in: a long key reaches the host once and only its fingerprint is
 * saved, an oauth code keeps its short limit, control characters and pasted error messages are refused, an answer is
 * taken only while the attempt waits, and a codex device sign-in takes no answer.
 */
#[TimeLimit(seconds: 3, reason: 'It commits attempts through the bus and empties three tables per test.')]
#[TestsCommand(SubmitSignInCodeCommand::class)]
final class SubmitSignInCodeTest extends TestCase
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
            ActorReference::forUser(TestIds::of(1)),
            new OwnerAuthority('test'),
        );
    }

    public function test_a_long_key_reaches_the_host_once_and_only_its_fingerprint_is_saved(): void
    {
        $key = str_repeat('k', 3000);
        $attempt = $this->signInAttempt(DefaultDrivers::CLAUDE_CODE, SignInMethod::ApiKey, 'request-1');

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
            $attempt = $this->signInAttempt($driver, SignInMethod::ApiKey, "request-{$index}");
            $this->submit($attempt, $key);
            $fingerprints[] = $attempt->refresh()->fingerprint;
        }

        $this->assertSame($fingerprints[0], $fingerprints[1]);
        $this->assertCount(3, array_unique($fingerprints));
    }

    public function test_an_oauth_code_keeps_its_short_limit_and_a_control_character_is_refused_for_both(): void
    {
        $oauth = $this->signInAttempt(DefaultDrivers::CLAUDE_CODE, SignInMethod::OAuth, 'request-1');
        $secret = $this->signInAttempt(DefaultDrivers::CLAUDE_CODE, SignInMethod::ApiKey, 'request-2');

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

        foreach ([
            SignInMethod::OAuth,
            SignInMethod::ProviderToken,
        ] as $index => $method) {
            $attempt = $this->signInAttempt(DefaultDrivers::CLAUDE_CODE, $method, "request-{$index}");

            $this->assertThrows(
                fn () => $this->submit($attempt, $pasted),
                SignInCodeInvalid::class,
                self::PASTE_ADVICE,
            );
            $this->assertNull($challenges->takeCode($attempt->refresh()));
            $this->assertTrue($attempt->refresh()->isLive());
            $this->assertNotSame(SignInStatus::Checking, $attempt->status);

            $this->submit($attempt, $code);
            $this->assertSame($code, $challenges->takeCode($attempt->refresh()));
            $this->assertSame(SignInStatus::Checking, $attempt->refresh()->status);
        }
    }

    public function test_an_answer_is_taken_only_while_the_attempt_waits_and_a_repeat_is_its_first_receipt(): void
    {
        $challenges = $this->app->make(SignInChallenges::class);
        $attempt = $this->signInAttempt(DefaultDrivers::CLAUDE_CODE, SignInMethod::OAuth, 'request-1');
        $answer = fn (string $code, string $key) => $this->app->make(CommandBus::class)
            ->run(new SubmitSignInCodeCommand($attempt->id, $code, $key));

        $this->assertThrows(fn () => $answer('1234', 'answer-1'), SignInAnswerRefused::class);
        $attempt->refresh()->waitForUser();
        $answer('1234', 'answer-1');
        $answer('9999', 'answer-1');

        $this->assertSame('1234', $challenges->takeCode($attempt->refresh()));
        $this->assertNull($challenges->takeCode($attempt->refresh()));
        $this->assertSame(SignInStatus::Checking, $attempt->refresh()->status);
        $this->assertThrows(fn () => $answer('5678', 'answer-2'), SignInAnswerRefused::class);
    }

    public function test_a_code_is_bounded_in_bytes_and_a_codex_device_sign_in_takes_no_answer(): void
    {
        $oauth = $this->signInAttempt(DefaultDrivers::CLAUDE_CODE, SignInMethod::OAuth, 'request-1');
        $device = $this->signInAttempt(DefaultDrivers::CODEX, SignInMethod::OAuth, 'request-2');

        $this->assertThrows(fn () => $this->submit($oauth, str_repeat('a', 513)), SignInCodeInvalid::class);
        $this->assertThrows(fn () => $this->submit($oauth, str_repeat('é', 257)), SignInCodeInvalid::class);
        $this->assertSame(SignInStatus::Waiting, $oauth->refresh()->status);
        $this->assertThrows(fn () => $this->submit($device, '1234'), SignInAnswerRefused::class);
        $this->assertSame(SignInStatus::Waiting, $device->refresh()->status);
    }

    private function signInAttempt(string $driver, SignInMethod $method, string $requestKey): SignInAttempt
    {
        return SignInAttempt::create(
            ActorReference::system(),
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
