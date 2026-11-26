<?php

declare(strict_types=1);

namespace Tests\Commands\Accounts;

use App\Commands\Accounts\BeginSignIn\BeginSignInCommand;
use App\Commands\Accounts\ClaimSignIn\ClaimSignInCommand;
use App\Commands\Accounts\NotifySignIn\NotifySignInCommand;
use App\Commands\Accounts\PublishSignInChallenge\PublishSignInChallengeCommand;
use App\Commands\Accounts\SubmitSignInCode\SubmitSignInCodeCommand;
use App\Commands\Accounts\TakeSignInCode\TakeSignInCodeCommand;
use App\Commands\Projects\EnrollHost\EnrollHostCommand;
use App\Enums\Accounts\SignInMethod;
use App\Enums\Accounts\SignInOutcome;
use App\Exceptions\SignInChallengeRefused;
use App\Jobs\SignInDeadline;
use App\Support\EnrolledHost;
use App\Support\SignInChallenges;
use App\Values\ClaimedSignIn;
use App\Values\SignInChallenge;
use App\Values\SignInIdentity;
use App\Values\SignInPoll;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A host publishes a sign-in's challenge: it reaches only the owner and no store, and a challenge outside the provider's
 * pages publishes no link while a stranger reads nothing.
 */
#[TimeLimit(seconds: 5, reason: 'It enrolls hosts, sends signed calls and runs a short host process.')]
#[TestsCommand(PublishSignInChallengeCommand::class)]
final class PublishSignInChallengeTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'accounts',
        'active_accounts',
        'sign_in_attempts',
        'command_receipts',
        'hosts',
        'users',
    ];

    private string $root;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();

        Bus::fake([SignInDeadline::class]);
        $this->root = sys_get_temp_dir().'/sign-in-host-'.bin2hex(random_bytes(4));
        config(['accounts.root' => $this->root]);
    }

    public function test_the_challenge_is_held_for_the_owner_and_a_typed_code_reaches_the_host_once(): void
    {
        $host = $this->enrollHost();
        $attemptId = $this->begin();
        $this->claim($host);
        $address = 'https://claude.ai/oauth/authorize?secret-state';
        $this->publishChallenge($host, $attemptId, ['address' => $address, 'code' => null]);
        $this->notify($host, $attemptId, SignInOutcome::Waiting);

        $this->journal->run(new SubmitSignInCodeCommand($attemptId, ' 1234 ', 'answer-1'));

        $this->assertSame($address, $this->challengeOf($attemptId)?->address);
        $poll = fn (int $generation) => $this->takeCode($host, $attemptId, $generation);
        $this->assertEquals(new SignInPoll(true, '1234'), $poll(0));
        $this->assertEquals(new SignInPoll(true, null), $poll(0));
        $this->assertEquals(SignInPoll::ended(), $poll(1));
    }

    public function test_a_challenge_outside_the_providers_pages_publishes_no_link(): void
    {
        $host = $this->enrollHost();
        $attemptId = $this->begin();
        $this->claim($host);

        foreach ([
            'https://claude.ai.evil.test/oauth',
            'http://claude.ai/oauth',
            'https://evil.test/claude.ai',
        ] as $address) {
            $this->journal->assertRefused(
                SignInChallengeRefused::class,
                fn () => $this->publishChallenge($host, $attemptId, ['address' => $address, 'code' => null]),
            );
        }

        $this->assertNull($this->challengeOf($attemptId));
    }

    private function challengeOf(string $attemptId): SignInChallenge|null
    {
        return $this->journal->service(SignInChallenges::class)->challengeOf($attemptId);
    }

    private function begin(): string
    {
        $this->journal->actAs('Owner');

        $begin = new BeginSignInCommand('claude-code', SignInMethod::OAuth);
        $started = $this->journal->run($begin, (string) Str::ulid());

        return $started->attemptId;
    }

    private function claim(EnrolledHost $host): ClaimedSignIn|null
    {
        return $this->journal->asSystem(new ClaimSignInCommand($host->hostId));
    }

    /**
     * @param  array{address: string, code: string|null}  $challenge
     */
    private function publishChallenge(EnrolledHost $host, string $attemptId, array $challenge): void
    {
        $this->journal->asSystem(
            new PublishSignInChallengeCommand($host->hostId, $attemptId, $challenge['address'], $challenge['code']),
        );
    }

    private function takeCode(EnrolledHost $host, string $attemptId, int $generation): SignInPoll
    {
        return $this->journal->asSystem(new TakeSignInCodeCommand($host->hostId, $attemptId, $generation));
    }

    private function notify(
        EnrolledHost $host,
        string $attemptId,
        SignInOutcome $outcome,
        SignInIdentity $identity = new SignInIdentity(null, null, null),
        string|null $refusal = null,
    ): void {
        $this->journal->asSystem(new NotifySignInCommand($host->hostId, $attemptId, 0, $outcome, $identity, $refusal));
    }

    private function enrollHost(): EnrolledHost
    {
        return $this->journal->asSystem(new EnrollHostCommand('test host '.Str::random(6), ['/work']));
    }
}
