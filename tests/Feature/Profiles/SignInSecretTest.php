<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Commands\Accounts\CompleteSignIn\CompleteSignInCommand;
use App\Commands\Accounts\SubmitSignInCode\SubmitSignInCodeCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Enums\Accounts\CommandEntry;
use App\Enums\Accounts\SignInMethod;
use App\Enums\Accounts\SignInStatus;
use App\Models\Access\User;
use App\Models\Accounts\Account;
use App\Models\Accounts\SignInAttempt;
use App\Support\Access\AccessSettings;
use App\Support\ActorContext;
use App\Support\ActorIdentity;
use App\Support\DefaultDrivers;
use App\Support\JournalCommands;
use App\Values\OwnerAuthority;
use App\Values\SignInIdentity;
use Carbon\CarbonImmutable;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Key accounts are named for their sign-in method, and the same key for the same driver is already added.
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

    public function test_key_accounts_are_named_for_their_method_and_the_same_key_is_already_added(): void
    {
        $this->app->instance(AccessSettings::class, new AccessSettings(TestIds::of(1)));
        User::factory()->create(['id' => TestIds::of(1)]);

        $first = $this->verifiedKey('request-1', 'key-1');
        $again = $this->verifiedKey('request-2', 'key-1');
        $this->verifiedKey('request-3', 'key-2');

        $labels = Account::query()->orderBy('created_at')->orderBy('id')->pluck('label')->all();
        $this->assertSame(['Claude Code API key', 'Claude Code API key (2)'], $labels);
        $this->assertSame(SignInStatus::AlreadyAdded, $again->refresh()->status);
        $this->assertSame(SignInStatus::Complete, $first->refresh()->status);
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
        $this->app->make(JournalCommands::class)->runAsJournal(
            CommandEntry::HostControl,
            'test host',
            new CompleteSignInCommand($attempt->id, $attempt->refresh()->generation, SignInIdentity::unproved()),
        );

        return $attempt;
    }

    private function signInAttempt(string $driver, SignInMethod $method, string $requestKey): SignInAttempt
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
