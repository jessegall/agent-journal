<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\Agents\Commands\EnrollHost;
use App\Agents\Support\EnrolledHost;
use App\Bus\Contracts\CommandBus;
use App\Files\Contracts\Files;
use App\Http\Data\Profiles\SignInAttemptData;
use App\Profiles\Commands\BeginSignIn;
use App\Profiles\Enums\SignInMethod;
use App\Profiles\Enums\SignInOutcome;
use App\Profiles\Enums\SignInState;
use App\Profiles\Exceptions\SignInMethodMissing;
use App\Profiles\Jobs\SignInDeadline;
use App\Profiles\Models\Account;
use App\Profiles\Models\SignInAttempt;
use App\Profiles\Support\PrivateSignInProcesses;
use App\Profiles\Support\SignInProtocols;
use App\Profiles\Values\ClaimedSignIn;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Tests\Fixtures\Profiles\FinishingProtocol;
use Tests\Fixtures\Profiles\LingeringProtocol;
use Tests\Fixtures\Profiles\RecordingSignInHost;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\SendsHostCalls;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * The host's sign-in runner and its signed transport: the enrolled host claims each sign-in once, reports only safe
 * outcomes for the attempts it runs, and the runner makes the account folder private, runs the program's own sign-in
 * and reports what the program's own check says.
 */
#[TimeLimit(seconds: 5, reason: 'It enrolls hosts, sends signed calls and runs a short host process.')]
final class SignInHostTest extends TestCase
{
    use CommitsHookRows;
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
        $this->assertSame(SignInMethod::OAuth, $this->attempt($attemptId)->method);
        $this->signed($host, '/host/sign-ins/claim')->assertNoContent();

        $this->report($host, $attemptId, 'waiting')->assertNoContent();
        $this->assertSame(SignInState::Waiting, $this->attempt($attemptId)->state);
        $proof = ['display' => 'work@example.test', 'subject' => 'subject-1', 'workspace' => 'workspace-1'];
        $this->report($host, $attemptId, 'verified', $proof)->assertNoContent();

        $this->assertSame(SignInState::Complete, $this->attempt($attemptId)->state);
        $account = Account::query()->withoutGlobalScopes()->sole();
        $this->assertSame(
            ['work@example.test', 'subject-1', 'workspace-1'],
            [$account->identity, $account->subject, $account->workspace],
        );
    }

    public function test_a_start_names_only_its_program_and_an_unknown_program_starts_nothing(): void
    {
        $owner = $this->owner();
        $start = ['driver' => 'claude-code', 'method' => 'oauth', 'request_key' => 'request-1'];

        $this->actingAs($owner)->post('/accounts/sign-ins', $start)->assertStatus(303);
        $this->actingAs($owner)->post('/accounts/sign-ins', [...$start, 'request_key' => 'request-2'])
            ->assertStatus(303);
        $unknown = ['driver' => 'gemini', 'method' => 'oauth', 'request_key' => 'request-3'];
        $this->actingAs($owner)->post('/accounts/sign-ins', $unknown)
            ->assertSessionHasErrors('driver');

        $this->assertSame(1, SignInAttempt::query()->withoutGlobalScopes()->count());
    }

    public function test_a_start_carries_its_method_and_an_undeclared_method_starts_nothing(): void
    {
        $owner = $this->owner();
        $start = fn (string $driver, string $method, string $key) => $this->actingAs($owner)
            ->post('/accounts/sign-ins', ['driver' => $driver, 'method' => $method, 'request_key' => $key]);

        $start('claude-code', 'api_key', 'request-1')->assertStatus(303);
        $start('codex', 'provider_token', 'request-2')->assertSessionHasErrors('method');
        $start('codex', 'password', 'request-3')->assertSessionHasErrors('method');

        $this->assertSame(SignInMethod::ApiKey, SignInAttempt::query()->withoutGlobalScopes()->sole()->method);
        $owner = ActorContext::forUser($this->owner()->id);
        $this->app->make(CurrentActorSetter::class)->set($owner, new OwnerAuthority('test'));
        $this->assertThrows(
            fn () => $this->app->make(CommandBus::class)->run(
                new BeginSignIn('codex', SignInMethod::ProviderToken, 'request-4'),
            ),
            SignInMethodMissing::class,
        );
        $this->assertSame(1, SignInAttempt::query()->withoutGlobalScopes()->count());
    }

    public function test_a_refused_report_keeps_the_providers_reason_for_the_form(): void
    {
        $host = $this->enrollHost();
        $attemptId = $this->begin();
        $this->signed($host, '/host/sign-ins/claim')->assertOk();

        $this->report($host, $attemptId, 'failed', ['refusal' => 'Invalid API key · Fix external API key'])
            ->assertNoContent();

        $attempt = $this->attempt($attemptId);
        $this->assertSame(SignInState::Failed, $attempt->state);
        $this->assertSame('Invalid API key · Fix external API key', SignInAttemptData::fromAttempt($attempt)->refusal);
    }

    public function test_another_host_and_an_unsigned_call_reach_no_attempt(): void
    {
        $host = $this->enrollHost();
        $other = $this->enrollHost();
        $attemptId = $this->begin();
        $this->signed($host, '/host/sign-ins/claim')->assertOk();

        $this->report($other, $attemptId, 'failed')->assertNotFound();
        $this->call('POST', '/host/sign-ins/claim')->assertUnauthorized();

        $this->assertSame(SignInState::Starting, $this->attempt($attemptId)->state);
    }

    public function test_the_challenge_reaches_only_the_owner_no_store_and_a_typed_code_reaches_the_host_once(): void
    {
        $owner = $this->owner();
        $host = $this->enrollHost();
        $this->actingAs($owner)->post('/accounts/sign-ins', [
            'driver' => 'claude-code',
            'method' => 'oauth',
            'request_key' => 'request-1',
        ])->assertStatus(303);
        $attemptId = (string) $this->signed($host, '/host/sign-ins/claim')->json('attempt_id');
        $challenge = ['address' => 'https://claude.ai/oauth/authorize?secret-state', 'code' => null];
        $this->signed($host, "/host/sign-ins/{$attemptId}/challenge", $challenge)->assertNoContent();

        $page = $this->actingAs($owner)->get('/accounts')->assertOk();
        $read = $this->actingAs($owner)->post("/accounts/sign-ins/{$attemptId}/challenge")->assertOk();
        $this->actingAs($owner)->post("/accounts/sign-ins/{$attemptId}/code", ['code' => ' 1234 '])->assertStatus(303);

        $this->assertSame($attemptId, $page->viewData('page')['props']['page']['data']['attempts'][0]['id']);
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
        $this->assertSame(SignInState::Cancelled, $this->attempt($attemptId)->state);
        $read = $this->actingAs($owner)->post("/accounts/sign-ins/{$attemptId}/challenge");
        $this->assertNull($read->json('address'));
    }

    public function test_the_runner_makes_the_folder_private_and_reports_what_the_check_says(): void
    {
        $directory = $this->root.'/new-account';
        $claimed = self::claimed('claude-code', SignInMethod::OAuth, $directory);
        $host = new RecordingSignInHost($claimed);
        $protocols = new SignInProtocols($this->app);
        $protocols->register('claude-code', SignInMethod::OAuth, FinishingProtocol::class);

        $ran = new PrivateSignInProcesses($host, $protocols, static fn () => usleep(10_000), $this->app->make(Files::class))->runNext();

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

        new PrivateSignInProcesses($host, $protocols, static fn () => usleep(10_000), $this->app->make(Files::class))->runNext();

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

        new PrivateSignInProcesses($host, $protocols, static fn () => null, $this->app->make(Files::class))->runNext();

        $this->assertSame([SignInOutcome::Failed], $host->outcomes);
    }

    public function test_a_program_without_an_installed_protocol_fails_its_sign_in(): void
    {
        $claimed = self::claimed('codex', SignInMethod::OAuth, $this->root.'/x');
        $host = new RecordingSignInHost($claimed);

        new PrivateSignInProcesses($host, new SignInProtocols($this->app), static fn () => null, $this->app->make(Files::class))->runNext();

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

        $begin = new BeginSignIn('claude-code', SignInMethod::OAuth, (string) Str::ulid());
        $started = $this->app->make(CommandBus::class)->run($begin);

        return $started->attemptId;
    }

    /**
     * A sign-in this test's host took, far from its deadline.
     */
    private static function claimed(string $driver, SignInMethod $method, string $directory): ClaimedSignIn
    {
        return new ClaimedSignIn('attempt-1', $driver, $method, $directory, 0, '2099-01-01T00:00:00+00:00', null);
    }

    private function attempt(string $attemptId): SignInAttempt
    {
        return SignInAttempt::query()->withoutGlobalScopes()->findOrFail($attemptId);
    }

    /**
     * @param  array<string, string>  $identity
     */
    private function report(
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
        return $this->asSystem(new EnrollHost('test host '.Str::random(6), ['/work']));
    }
}
