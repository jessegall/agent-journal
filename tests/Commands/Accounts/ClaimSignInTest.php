<?php

declare(strict_types=1);

namespace Tests\Commands\Accounts;

use App\Commands\Accounts\BeginSignIn\BeginSignInCommand;
use App\Commands\Projects\EnrollHost\EnrollHostCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Enums\Accounts\SignInMethod;
use App\Enums\Accounts\SignInStatus;
use App\Jobs\SignInDeadline;
use App\Models\Access\User;
use App\Models\Accounts\Account;
use App\Models\Accounts\SignInAttempt;
use App\Support\Access\AccessSettings;
use App\Support\ActorContext;
use App\Support\EnrolledHost;
use App\Values\OwnerAuthority;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsKeyedCommands;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\SendsHostCalls;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A host claims a waiting sign-in once and its verified report saves the account; another host and an unsigned call
 * reach no attempt.
 */
#[TimeLimit(seconds: 5, reason: 'It enrolls hosts, sends signed calls and runs a short host process.')]
final class ClaimSignInTest extends TestCase
{
    use CommitsHookRows;
    use RunsKeyedCommands;
    use RunsTrustedCommands;
    use SendsHostCalls;

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

    public function test_the_host_claims_once_and_its_verified_report_saves_the_account(): void
    {
        $host = $this->enrollHost();
        $attemptId = $this->begin();

        $claim = $this->signed($host, '/host/sign-ins/claim')->assertOk();
        $this->assertSame($attemptId, $claim->json('attempt_id'));
        $this->assertSame('oauth', $claim->json('method'));
        $this->assertSame(SignInMethod::OAuth, $this->signInAttempt($attemptId)->method);
        $this->signed($host, '/host/sign-ins/claim')->assertNoContent();

        $this->notify($host, $attemptId, 'waiting')->assertNoContent();
        $this->assertSame(SignInStatus::Waiting, $this->signInAttempt($attemptId)->status);
        $proof = ['display' => 'work@example.test', 'subject' => 'subject-1', 'workspace' => 'workspace-1'];
        $this->notify($host, $attemptId, 'verified', $proof)->assertNoContent();

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
        $this->signed($host, '/host/sign-ins/claim')->assertOk();

        $this->notify($other, $attemptId, 'failed')->assertNotFound();
        $this->call('POST', '/host/sign-ins/claim')->assertUnauthorized();

        $this->assertSame(SignInStatus::Starting, $this->signInAttempt($attemptId)->status);
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
        $started = $this->runOnBus($begin, (string) Str::ulid());

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
        return $this->signedHostCall($host, 'POST', $target, $body === [] ? '' : (string) json_encode($body));
    }

    private function enrollHost(): EnrolledHost
    {
        return $this->asSystem(new EnrollHostCommand('test host '.Str::random(6), ['/work']));
    }
}
