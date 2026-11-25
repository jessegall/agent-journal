<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Commands\Accounts\BeginSignIn\BeginSignInCommand;
use App\Commands\Projects\EnrollHost\EnrollHostCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Files\Files;
use App\Data\Accounts\SignInAttemptData;
use App\Enums\Accounts\SignInMethod;
use App\Enums\Accounts\SignInOutcome;
use App\Enums\Accounts\SignInRefusal;
use App\Enums\Accounts\SignInStatus;
use App\Exceptions\SignInMethodMissing;
use App\Jobs\SignInDeadline;
use App\Models\Access\User;
use App\Models\Accounts\Account;
use App\Models\Accounts\SignInAttempt;
use App\Support\Access\AccessSettings;
use App\Support\ActorContext;
use App\Support\EnrolledHost;
use App\Support\LocalAccountFolders;
use App\Support\PrivateSignInProcesses;
use App\Support\SignInChallenges;
use App\Support\SignInProtocols;
use App\Values\ClaimedSignIn;
use App\Values\OwnerAuthority;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Tests\Fixtures\Profiles\ClosedInputProtocol;
use Tests\Fixtures\Profiles\FinishingProtocol;
use Tests\Fixtures\Profiles\LingeringProtocol;
use Tests\Fixtures\Profiles\RecordingSignInHost;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsKeyedCommands;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\SendsHostCalls;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * The host's sign-in runner and its signed transport: the enrolled host claims each sign-in once, reports only safe
 * outcomes for the attempts it runs, and the runner makes the account folder private, runs the driver's own sign-in
 * and reports what the driver's own check says.
 */
#[TimeLimit(seconds: 5, reason: 'It enrolls hosts, sends signed calls and runs a short host process.')]
final class SignInHostTest extends TestCase
{
    use CommitsHookRows;
    use RunsKeyedCommands;
    use RunsTrustedCommands;
    use SendsHostCalls;

    private const string FRESH_SIGN_IN = 'start a fresh sign-in';

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

    protected function tearDown(): void
    {
        exec('rm -rf '.escapeshellarg($this->root));
        parent::tearDown();
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

    public function test_a_start_names_only_its_program_and_an_unknown_program_starts_nothing(): void
    {
        $owner = $this->owner();
        $start = ['driver' => 'claude-code', 'method' => 'oauth'];

        $this->actingAs($owner)->withHeader('Idempotency-Key', 'request-1')->post('/accounts/sign-ins', $start)
            ->assertStatus(303);
        $this->actingAs($owner)->withHeader('Idempotency-Key', 'request-2')->post('/accounts/sign-ins', $start)
            ->assertStatus(303);
        $unknown = ['driver' => 'gemini', 'method' => 'oauth'];
        $this->actingAs($owner)->withHeader('Idempotency-Key', 'request-3')->post('/accounts/sign-ins', $unknown)
            ->assertSessionHasErrors('driver');

        $this->assertSame(1, SignInAttempt::query()->withoutGlobalScopes()->count());
    }

    public function test_a_start_carries_its_method_and_an_undeclared_method_starts_nothing(): void
    {
        $owner = $this->owner();
        $start = fn (string $driver, string $method, string $key) => $this->actingAs($owner)
            ->withHeader('Idempotency-Key', $key)
            ->post('/accounts/sign-ins', ['driver' => $driver, 'method' => $method]);

        $start('claude-code', 'api_key', 'request-1')->assertStatus(303);
        $start('codex', 'provider_token', 'request-2')->assertSessionHasErrors('method');
        $start('codex', 'password', 'request-3')->assertSessionHasErrors('method');

        $this->assertSame(SignInMethod::ApiKey, SignInAttempt::query()->withoutGlobalScopes()->sole()->method);
        $owner = ActorContext::forUser($this->owner()->id);
        $this->app->make(CurrentActorSetter::class)->set($owner, new OwnerAuthority('test'));
        $this->assertThrows(
            fn () => $this->runOnBus(new BeginSignInCommand('codex', SignInMethod::ProviderToken), 'request-4'),
            SignInMethodMissing::class,
        );
        $this->assertSame(1, SignInAttempt::query()->withoutGlobalScopes()->count());
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

    public function test_the_challenge_reaches_only_the_owner_no_store_and_a_typed_code_reaches_the_host_once(): void
    {
        $owner = $this->owner();
        $host = $this->enrollHost();
        $this->actingAs($owner)->withHeader('Idempotency-Key', 'request-1')->post('/accounts/sign-ins', [
            'driver' => 'claude-code',
            'method' => 'oauth',
        ])->assertStatus(303);
        $attemptId = (string) $this->signed($host, '/host/sign-ins/claim')->json('attempt_id');
        $challenge = ['address' => 'https://claude.ai/oauth/authorize?secret-state', 'code' => null];
        $this->signed($host, "/host/sign-ins/{$attemptId}/challenge", $challenge)->assertNoContent();
        $this->notify($host, $attemptId, 'waiting')->assertNoContent();

        $page = $this->actingAs($owner)->get('/accounts?add=1')->assertOk();
        $read = $this->actingAs($owner)->post("/accounts/sign-ins/{$attemptId}/challenge")->assertOk();
        $this->actingAs($owner)->withHeader('Idempotency-Key', 'answer-1')
            ->post("/accounts/sign-ins/{$attemptId}/code", ['code' => ' 1234 '])->assertStatus(303);

        $this->assertSame($attemptId, $page->viewData('page')['props']['page']['data']['root']['children'][1]['children'][1]['native']['props']['attempts'][0]['id']);
        $this->assertStringNotContainsString('secret-state', (string) $page->getContent());
        $this->assertSame('https://claude.ai/oauth/authorize?secret-state', $read->json('address'));
        $this->assertStringContainsString('no-store', (string) $read->headers->get('Cache-Control'));
        $code = "/host/sign-ins/{$attemptId}/code";
        $poll = fn (int $generation) => $this->signed($host, $code, ['generation' => $generation]);
        $poll(0)->assertExactJson(['live' => true, 'code' => '1234']);
        $poll(0)->assertExactJson(['live' => true, 'code' => null]);
        $poll(1)->assertExactJson(['live' => false, 'code' => null]);
        $stranger = User::factory()->create();
        $this->assertFalse($this->actingAs($stranger)->post("/accounts/sign-ins/{$attemptId}/challenge")->isOk());
    }

    public function test_a_code_with_a_control_character_and_a_cancelled_sign_in_give_the_host_nothing(): void
    {
        $owner = $this->owner();
        $host = $this->enrollHost();
        $attemptId = $this->begin();
        $this->signed($host, '/host/sign-ins/claim');

        $this->actingAs($owner)->post("/accounts/sign-ins/{$attemptId}/code", ['code' => "12\u{0007}34"]);
        $this->actingAs($owner)->post("/accounts/sign-ins/{$attemptId}/cancel")->assertStatus(303);
        $this->actingAs($owner)->post("/accounts/sign-ins/{$attemptId}/code", ['code' => '1234']);

        $this->signed($host, "/host/sign-ins/{$attemptId}/code", ['generation' => 0])
            ->assertExactJson(['live' => false, 'code' => null]);
        $this->assertSame(SignInStatus::Cancelled, $this->signInAttempt($attemptId)->status);
        $read = $this->actingAs($owner)->post("/accounts/sign-ins/{$attemptId}/challenge");
        $this->assertNull($read->json('address'));
    }

    public function test_an_answer_whose_acceptance_never_committed_is_never_handed_to_the_host(): void
    {
        $owner = $this->owner();
        $host = $this->enrollHost();
        $attemptId = $this->begin();
        $this->signed($host, '/host/sign-ins/claim');
        $this->notify($host, $attemptId, 'waiting')->assertNoContent();

        $this->app->make(SignInChallenges::class)
            ->typeCode($attemptId, 'answer-rolled-back', '1234', CarbonImmutable::now()->addMinutes(5));

        $this->signed($host, "/host/sign-ins/{$attemptId}/code", ['generation' => 0])
            ->assertExactJson(['live' => true, 'code' => null]);
        $this->actingAs($owner)->withHeader('Idempotency-Key', 'answer-1')
            ->post("/accounts/sign-ins/{$attemptId}/code", ['code' => '5678'])->assertStatus(303);
        $this->signed($host, "/host/sign-ins/{$attemptId}/code", ['generation' => 0])
            ->assertExactJson(['live' => true, 'code' => '5678']);
    }

    public function test_a_delivery_that_breaks_ends_the_attempt_interrupted_with_the_answer_erased(): void
    {
        $host = $this->enrollHost();
        $attemptId = $this->begin();
        $this->signed($host, '/host/sign-ins/claim');
        $this->notify($host, $attemptId, 'waiting')->assertNoContent();
        $this->actingAs($this->owner())->withHeader('Idempotency-Key', 'answer-1')
            ->post("/accounts/sign-ins/{$attemptId}/code", ['code' => '1234'])->assertStatus(303);

        $this->notify($host, $attemptId, 'interrupted')->assertNoContent();

        $attempt = $this->signInAttempt($attemptId);
        $this->assertSame(SignInStatus::Interrupted, $attempt->status);
        $this->assertNull($attempt->refusal);
        $this->assertNull($this->app->make(SignInChallenges::class)->takeCode($attempt));
    }

    public function test_the_runner_stops_a_program_its_answer_could_not_reach_and_reports_it_interrupted(): void
    {
        $directory = $this->root.'/new-account';
        $host = new RecordingSignInHost(self::claimed('claude-code', SignInMethod::OAuth, $directory));
        $host->answer = '1234';
        $protocols = new SignInProtocols($this->app);
        $protocols->register('claude-code', SignInMethod::OAuth, ClosedInputProtocol::class);

        new PrivateSignInProcesses($host, $protocols, static fn () => usleep(10_000), $this->app->make(Files::class), new LocalAccountFolders($this->app->make(Files::class)))->runNext();

        $this->assertSame([SignInOutcome::Waiting, SignInOutcome::Interrupted], $host->outcomes);
        $this->assertStringContainsString(self::FRESH_SIGN_IN, (string) end($host->refusals));
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

    public function test_a_challenge_outside_the_providers_pages_publishes_no_link_and_a_stranger_reads_nothing(): void
    {
        $owner = $this->owner();
        $host = $this->enrollHost();
        $attemptId = $this->begin();
        $this->signed($host, '/host/sign-ins/claim');

        foreach (['https://claude.ai.evil.test/oauth', 'http://claude.ai/oauth', 'https://evil.test/claude.ai'] as $address) {
            $this->signed($host, "/host/sign-ins/{$attemptId}/challenge", ['address' => $address, 'code' => null])
                ->assertStatus(422)
                ->assertDontSee($address, false);
        }

        $this->assertNull($this->actingAs($owner)->post("/accounts/sign-ins/{$attemptId}/challenge")->json('address'));
        $challenge = ['address' => 'https://claude.ai/oauth/authorize?state', 'code' => null];
        $this->signed($host, "/host/sign-ins/{$attemptId}/challenge", $challenge)->assertNoContent();
        $stranger = $this->actingAs(User::factory()->create())->post("/accounts/sign-ins/{$attemptId}/challenge");
        $this->assertFalse($stranger->isOk());
        $this->assertStringNotContainsString('claude.ai', (string) $stranger->getContent());
    }

    public function test_a_failed_answer_flashes_no_code_into_the_session(): void
    {
        $owner = $this->owner();
        $host = $this->enrollHost();
        $attemptId = $this->begin();
        $this->signed($host, '/host/sign-ins/claim');
        $this->notify($host, $attemptId, 'waiting')->assertNoContent();

        $this->actingAs($owner)->withHeader('Idempotency-Key', 'answer-1')
            ->from('/accounts')
            ->post("/accounts/sign-ins/{$attemptId}/code", ['code' => 'secret code with spaces'])
            ->assertStatus(303)
            ->assertSessionMissing('_old_input.code');
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

    public function test_the_runner_stops_a_program_at_its_deadline_and_proves_nothing(): void
    {
        $directory = $this->root.'/new-account';
        $host = new RecordingSignInHost(new ClaimedSignIn(
            'attempt-1',
            'claude-code',
            SignInMethod::OAuth,
            $directory,
            0,
            CarbonImmutable::now()->addMilliseconds(300)->toIso8601ZuluString('millisecond'),
            null,
        ));
        $protocols = new SignInProtocols($this->app);
        $protocols->register('claude-code', SignInMethod::OAuth, LingeringProtocol::class);

        $ran = new PrivateSignInProcesses($host, $protocols, static fn () => usleep(50_000), $this->app->make(Files::class), new LocalAccountFolders($this->app->make(Files::class)))->runNext();

        $this->assertTrue($ran);
        $this->assertSame([SignInOutcome::Waiting], $host->outcomes);
    }

    public function test_the_runner_makes_the_folder_private_and_reports_what_the_check_says(): void
    {
        $directory = $this->root.'/new-account';
        $claimed = self::claimed('claude-code', SignInMethod::OAuth, $directory);
        $host = new RecordingSignInHost($claimed);
        $protocols = new SignInProtocols($this->app);
        $protocols->register('claude-code', SignInMethod::OAuth, FinishingProtocol::class);

        $ran = new PrivateSignInProcesses($host, $protocols, static fn () => usleep(10_000), $this->app->make(Files::class), new LocalAccountFolders($this->app->make(Files::class)))->runNext();

        $this->assertTrue($ran);
        $this->assertSame([SignInOutcome::Waiting, SignInOutcome::Verified], $host->outcomes);
        $this->assertSame(['work@example.test'], array_values(array_filter($host->identities)));
        $this->assertSame('0700', substr(sprintf('%o', fileperms($directory)), -4));
    }

    public function test_an_attempt_the_journal_ended_stops_the_program_and_reports_nothing_more(): void
    {
        $directory = $this->root.'/new-account';
        $claimed = self::claimed('claude-code', SignInMethod::OAuth, $directory);
        $host = new RecordingSignInHost($claimed);
        $host->livePolls = 2;
        $protocols = new SignInProtocols($this->app);
        $protocols->register('claude-code', SignInMethod::OAuth, LingeringProtocol::class);

        new PrivateSignInProcesses($host, $protocols, static fn () => usleep(10_000), $this->app->make(Files::class), new LocalAccountFolders($this->app->make(Files::class)))->runNext();

        $this->assertSame([SignInOutcome::Waiting], $host->outcomes);
        $this->assertSame(2, $host->pollCount);
    }

    public function test_a_method_the_host_cannot_serve_fails_its_sign_in(): void
    {
        $directory = $this->root.'/new-account';
        $claimed = self::claimed('claude-code', SignInMethod::ApiKey, $directory);
        $host = new RecordingSignInHost($claimed);
        $protocols = new SignInProtocols($this->app);
        $protocols->register('claude-code', SignInMethod::OAuth, FinishingProtocol::class);

        new PrivateSignInProcesses($host, $protocols, static fn () => null, $this->app->make(Files::class), new LocalAccountFolders($this->app->make(Files::class)))->runNext();

        $this->assertSame([SignInOutcome::Failed], $host->outcomes);
    }

    public function test_a_program_without_an_installed_protocol_fails_its_sign_in(): void
    {
        $claimed = self::claimed('codex', SignInMethod::OAuth, $this->root.'/x');
        $host = new RecordingSignInHost($claimed);

        new PrivateSignInProcesses($host, new SignInProtocols($this->app), static fn () => null, $this->app->make(Files::class), new LocalAccountFolders($this->app->make(Files::class)))->runNext();

        $this->assertSame([SignInOutcome::Failed], $host->outcomes);
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

    /**
     * A sign-in this test's host took, far from its deadline.
     */
    private static function claimed(string $driver, SignInMethod $method, string $directory): ClaimedSignIn
    {
        return new ClaimedSignIn('attempt-1', $driver, $method, $directory, 0, '2099-01-01T00:00:00+00:00', null);
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
