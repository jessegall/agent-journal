<?php

declare(strict_types=1);

namespace Tests\Commands\Accounts;

use App\Accounts\Commands\BeginSignIn\BeginSignInCommand;
use App\Accounts\Commands\ClaimSignIn\ClaimSignInCommand;
use App\Accounts\Commands\NotifySignIn\NotifySignInCommand;
use App\Accounts\Commands\PublishSignInChallenge\PublishSignInChallengeCommand;
use App\Accounts\Commands\TakeSignInCode\TakeSignInCodeCommand;
use App\Accounts\Enums\SignInMethod;
use App\Accounts\Enums\SignInOutcome;
use App\Accounts\Enums\SignInStatus;
use App\Accounts\Exceptions\SignInAttemptMissing;
use App\Accounts\Values\ClaimedSignIn;
use App\Accounts\Values\SignInPoll;
use App\Hosts\EnrolledHost;
use App\Jobs\SignInDeadline;
use App\Models\Accounts\Account;
use App\Models\Accounts\SignInAttempt;
use App\Projects\Commands\EnrollHost\EnrollHostCommand;
use App\Values\SignInIdentity;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A host claims a waiting sign-in once and its verified report saves the account; another host and an unsigned call
 * reach no attempt.
 */
#[TimeLimit(seconds: 5, reason: 'It enrolls hosts, sends signed calls and runs a short host process.')]
#[TestsCommand(ClaimSignInCommand::class)]
final class ClaimSignInTest extends TestCase
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

    public function test_the_host_claims_once_and_its_verified_report_saves_the_account(): void
    {
        $host = $this->enrollHost();
        $attemptId = $this->begin();

        $claim = $this->claim($host);
        $this->assertSame($attemptId, $claim?->attemptId);
        $this->assertSame(SignInMethod::OAuth, $claim?->method);
        $this->assertSame(SignInMethod::OAuth, $this->signInAttempt($attemptId)->method);
        $this->assertNull($this->claim($host));

        $this->notify($host, $attemptId, SignInOutcome::Waiting);
        $this->assertSame(SignInStatus::Waiting, $this->signInAttempt($attemptId)->status);
        $proof = new SignInIdentity('work@example.test', 'subject-1', 'workspace-1');
        $this->notify($host, $attemptId, SignInOutcome::Verified, $proof);

        $this->assertSame(SignInStatus::Complete, $this->signInAttempt($attemptId)->status);
        $account = Account::query()->withoutGlobalScopes()->sole();
        $this->assertSame(
            ['work@example.test', 'subject-1', 'workspace-1'],
            [$account->identity, $account->subject, $account->workspace],
        );
    }

    public function test_another_host_and_an_unsigned_call_reach_no_attempt(): void
    {
        $host = $this->enrollHost();
        $other = $this->enrollHost();
        $attemptId = $this->begin();
        $this->claim($host);

        $this->assertThrows(fn () => $this->notify($other, $attemptId, SignInOutcome::Failed), SignInAttemptMissing::class);

        $this->assertSame(SignInStatus::Starting, $this->signInAttempt($attemptId)->status);
    }

    private function begin(): string
    {
        $this->journal->actAs('Owner');

        $begin = new BeginSignInCommand('claude-code', SignInMethod::OAuth);
        $started = $this->journal->run($begin, (string) Str::ulid());

        return $started->attemptId;
    }

    private function signInAttempt(string $attemptId): SignInAttempt
    {
        return SignInAttempt::query()->withoutGlobalScopes()->findOrFail($attemptId);
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
