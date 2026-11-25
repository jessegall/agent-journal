<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Commands\Accounts\BeginSignIn\BeginSignInCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Enums\Accounts\SignInMethod;
use App\Exceptions\SignInMethodMissing;
use App\Jobs\SignInDeadline;
use App\Models\Access\User;
use App\Models\Accounts\Account;
use App\Models\Accounts\SignInAttempt;
use App\Support\Access\AccessSettings;
use App\Support\ActorContext;
use App\Values\OwnerAuthority;
use Illuminate\Support\Facades\Bus;
use Tests\Support\CommitsHookRows;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * The host's sign-in runner: a start names only its program and carries its method, and the runner stops a program
 * its answer could not reach or at its deadline, makes the account folder private, stops when the journal ended the
 * attempt, and fails a method or program it cannot serve.
 */
#[TimeLimit(seconds: 5, reason: 'It enrolls hosts, sends signed calls and runs a short host process.')]
final class SignInHostTest extends TestCase
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

    protected function tearDown(): void
    {
        exec('rm -rf '.escapeshellarg($this->root));
        parent::tearDown();
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
            fn () => $this->journal->run(new BeginSignInCommand('codex', SignInMethod::ProviderToken), 'request-4'),
            SignInMethodMissing::class,
        );
        $this->assertSame(1, SignInAttempt::query()->withoutGlobalScopes()->count());
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
}
