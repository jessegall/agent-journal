<?php

declare(strict_types=1);

namespace Tests\Commands\Accounts;

use App\Commands\Accounts\BeginSignIn\BeginSignInCommand;
use App\Commands\Accounts\ClaimSignIn\ClaimSignInCommand;
use App\Commands\Accounts\NotifySignIn\NotifySignInCommand;
use App\Commands\Accounts\PublishSignInChallenge\PublishSignInChallengeCommand;
use App\Commands\Accounts\TakeSignInCode\TakeSignInCodeCommand;
use App\Commands\Projects\EnrollHost\EnrollHostCommand;
use App\Data\Accounts\SignInAttemptData;
use App\Enums\Accounts\SignInMethod;
use App\Enums\Accounts\SignInOutcome;
use App\Enums\Accounts\SignInRefusal;
use App\Enums\Accounts\SignInStatus;
use App\Jobs\SignInDeadline;
use App\Models\Accounts\Account;
use App\Models\Accounts\SignInAttempt;
use App\Support\EnrolledHost;
use App\Support\SignInChallenges;
use App\Values\ClaimedSignIn;
use App\Values\SignInIdentity;
use App\Values\SignInPoll;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A host reports how a sign-in ended: a refusal keeps the provider's reason for the form, a message outside the reasons
 * shows the generic failure, and a success after the deadline ends expired while a later failure changes nothing.
 */
#[TimeLimit(seconds: 5, reason: 'It enrolls hosts, sends signed calls and runs a short host process.')]
#[TestsCommand(NotifySignInCommand::class)]
final class NotifySignInTest extends TestCase
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

    public function test_a_refused_report_keeps_the_providers_reason_for_the_form(): void
    {
        $host = $this->enrollHost();
        $attemptId = $this->begin();
        $this->claim($host);

        $this->notify($host, $attemptId, SignInOutcome::Failed, refusal: 'Invalid API key · Fix external API key');

        $attempt = $this->signInAttempt($attemptId);
        $this->assertSame(SignInStatus::Failed, $attempt->status);
        $this->assertSame(
            SignInRefusal::RejectedCredential->text(),
            SignInAttemptData::fromAttempt($attempt->load('resultAccount'))->refusal,
        );
    }

    public function test_a_provider_message_outside_the_reasons_shows_the_generic_failure(): void
    {
        $host = $this->enrollHost();
        $attemptId = $this->begin();
        $this->claim($host);

        $this->notify($host, $attemptId, SignInOutcome::Failed, refusal: 'stack trace at /home/user/.claude/secret line 3');

        $this->assertSame(SignInRefusal::Unknown->text(), $this->signInAttempt($attemptId)->refusal);
    }

    public function test_a_success_after_the_deadline_ends_expired_and_a_later_failure_changes_nothing(): void
    {
        $host = $this->enrollHost();
        $attemptId = $this->begin();
        $this->claim($host);
        $challenge = ['address' => 'https://claude.ai/oauth/authorize?state', 'code' => null];
        $this->publishChallenge($host, $attemptId, $challenge);
        $this->notify($host, $attemptId, SignInOutcome::Waiting);
        $this->travelTo($this->signInAttempt($attemptId)->expires_at->addSecond());

        $proof = new SignInIdentity('work@example.test', 'subject-1', 'workspace-1');
        $this->notify($host, $attemptId, SignInOutcome::Verified, $proof);
        $this->notify($host, $attemptId, SignInOutcome::Failed, refusal: 'Too late');

        $attempt = $this->signInAttempt($attemptId);
        $this->assertSame(SignInStatus::Expired, $attempt->status);
        $this->assertNull($attempt->refusal);
        $this->assertSame(0, Account::query()->withoutGlobalScopes()->count());
        $this->assertNull($this->app->make(SignInChallenges::class)->challengeOf($attemptId));
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
