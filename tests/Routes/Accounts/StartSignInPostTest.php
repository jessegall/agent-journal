<?php

declare(strict_types=1);

namespace Tests\Routes\Accounts;

use App\Commands\Accounts\BeginSignIn\BeginSignInCommand;
use App\Enums\Accounts\SignInMethod;
use App\Values\SignInStarted;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner starts signing a new account in, with the driver and method they chose.
 */
#[TestsRoute('POST', 'accounts.start-sign-in')]
final class StartSignInPostTest extends GuardedRouteEntryTestCase
{
    public function test_an_unknown_program_or_a_method_its_program_lacks_is_refused_and_nothing_is_sent(): void
    {
        $this->journal->owner()->sinkCommands();

        foreach ([['gemini', 'oauth', 'driver'], ['codex', 'provider_token', 'method'], ['codex', 'password', 'method']] as [$driver, $method, $field]) {
            $this->journal->route('POST', 'accounts.start-sign-in', payload: ['driver' => $driver, 'method' => $method])
                ->assertSessionHasErrors($field);
        }

        $this->journal->assertNothingDispatched();
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner()->user('Member');

        return RouteCall::recorded('account-sign-in', [])
            ->reply(BeginSignInCommand::class, new SignInStarted(strtolower((string) Str::ulid()), false))
            ->expects(BeginSignInCommand::class, [
                'driver' => 'claude-code',
                'method' => SignInMethod::OAuth,
            ])
            ->hiddenFrom('Member');
    }
}
