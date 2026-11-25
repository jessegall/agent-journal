<?php

declare(strict_types=1);

namespace Tests\Commands\Accounts;

use App\Commands\Accounts\BeginSignIn\BeginSignInCommand;
use App\Commands\Projects\EnrollHost\EnrollHostCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Data\Accounts\SignInAttemptData;
use App\Enums\Accounts\SignInMethod;
use App\Enums\Accounts\SignInRefusal;
use App\Enums\Accounts\SignInStatus;
use App\Jobs\SignInDeadline;
use App\Models\Access\User;
use App\Models\Accounts\Account;
use App\Models\Accounts\SignInAttempt;
use App\Support\Access\AccessSettings;
use App\Support\ActorContext;
use App\Support\EnrolledHost;
use App\Support\SignInChallenges;
use App\Values\OwnerAuthority;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Tests\Support\CommitsHookRows;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A host reports how a sign-in ended: a refusal keeps the provider's reason for the form, a message outside the reasons
 * shows the generic failure, and a success after the deadline ends expired while a later failure changes nothing.
 */
#[TimeLimit(seconds: 5, reason: 'It enrolls hosts, sends signed calls and runs a short host process.')]
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

    private User|null $owner = null;

    private string $root;

    protected function setUp(): void
    {
        parent::setUp();

        Bus::fake([SignInDeadline::class]);
        $this->root = sys_get_temp_dir().'/sign-in-host-'.bin2hex(random_bytes(4));
        config(['accounts.root' => $this->root]);
    }

    public function test_a_refused_report_keeps_the_providers_reason_for_the_form(): void
    {
        $host = $this->enrollHost();
        $attemptId = $this->begin();
        $this->signed($host, '/host/sign-ins/claim')->assertOk();

        $this->notify($host, $attemptId, 'failed', ['refusal' => 'Invalid API key · Fix external API key'])
            ->assertNoContent();

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
        $this->signed($host, '/host/sign-ins/claim')->assertOk();

        $this->notify($host, $attemptId, 'failed', ['refusal' => 'stack trace at /home/user/.claude/secret line 3'])
            ->assertNoContent();

        $this->assertSame(SignInRefusal::Unknown->text(), $this->signInAttempt($attemptId)->refusal);
    }

    public function test_a_success_after_the_deadline_ends_expired_and_a_later_failure_changes_nothing(): void
    {
        $host = $this->enrollHost();
        $attemptId = $this->begin();
        $this->signed($host, '/host/sign-ins/claim');
        $challenge = ['address' => 'https://claude.ai/oauth/authorize?state', 'code' => null];
        $this->signed($host, "/host/sign-ins/{$attemptId}/challenge", $challenge)->assertNoContent();
        $this->notify($host, $attemptId, 'waiting')->assertNoContent();
        $this->travelTo($this->signInAttempt($attemptId)->expires_at->addSecond());

        $proof = ['display' => 'work@example.test', 'subject' => 'subject-1', 'workspace' => 'workspace-1'];
        $this->notify($host, $attemptId, 'verified', $proof);
        $this->notify($host, $attemptId, 'failed', ['refusal' => 'Too late'])->assertNoContent();

        $attempt = $this->signInAttempt($attemptId);
        $this->assertSame(SignInStatus::Expired, $attempt->status);
        $this->assertNull($attempt->refusal);
        $this->assertSame(0, Account::query()->withoutGlobalScopes()->count());
        $this->assertNull($this->app->make(SignInChallenges::class)->challengeOf($attemptId));
    }

    /**
     * The journal's owner, made once per test, as the web sign-in admits them.
     */
    private function owner(): User
    {
        $this->owner ??= User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));

        return $this->owner;
    }

    private function begin(): string
    {
        $owner = ActorContext::forUser($this->owner()->id);
        $this->app->make(CurrentActorSetter::class)->set($owner, new OwnerAuthority('test'));

        $begin = new BeginSignInCommand('claude-code', SignInMethod::OAuth);
        $started = $this->journal->run($begin, (string) Str::ulid());

        return $started->attemptId;
    }

    private function signInAttempt(string $attemptId): SignInAttempt
    {
        return SignInAttempt::query()->withoutGlobalScopes()->findOrFail($attemptId);
    }

    /**
     * @param  array<string, string>  $identity
     */
    private function notify(
        EnrolledHost $host,
        string $attemptId,
        string $outcome,
        array $identity = [],
    ): TestResponse {
        $body = ['outcome' => $outcome, 'generation' => 0, ...$identity];

        return $this->signed($host, "/host/sign-ins/{$attemptId}/report", $body);
    }

    /**
     * @param  array<string, mixed>  $body
     */
    private function signed(EnrolledHost $host, string $target, array $body = []): TestResponse
    {
        return $this->journal->hostCall($host, 'POST', $target, $body === [] ? '' : (string) json_encode($body));
    }

    private function enrollHost(): EnrolledHost
    {
        return $this->journal->asSystem(new EnrollHostCommand('test host '.Str::random(6), ['/work']));
    }
}
