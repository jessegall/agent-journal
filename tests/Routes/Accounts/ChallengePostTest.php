<?php

declare(strict_types=1);

namespace Tests\Routes\Accounts;

use App\Accounts\Commands\BeginSignIn\BeginSignInCommand;
use App\Accounts\Commands\ClaimSignIn\ClaimSignInCommand;
use App\Accounts\Commands\PublishSignInChallenge\PublishSignInChallengeCommand;
use App\Accounts\Enums\SignInMethod;
use App\Jobs\SignInDeadline;
use App\Projects\Commands\EnrollHost\EnrollHostCommand;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner's page reads the address and code a running sign-in shows: nothing is sent on.
 */
#[TestsRoute('POST', 'accounts.challenge')]
final class ChallengePostTest extends GuardedRouteEntryTestCase
{
    public function test_the_owner_reads_a_live_sign_ins_challenge_and_no_cache_keeps_it(): void
    {
        config(['journal.accounts.root' => sys_get_temp_dir().'/sign-in-challenge-'.bin2hex(random_bytes(4))]);
        Bus::fake([SignInDeadline::class]);
        $this->journal->owner();
        $host = $this->journal->asSystem(new EnrollHostCommand('test host', ['/work']));
        $attemptId = $this->journal->run(new BeginSignInCommand('claude-code', SignInMethod::OAuth))->attemptId;
        $this->journal->asSystem(new ClaimSignInCommand($host->hostId));
        $address = 'https://claude.ai/oauth/authorize?secret-state';
        $this->journal->asSystem(new PublishSignInChallengeCommand($host->hostId, $attemptId, $address, null));

        $read = $this->journal->route('POST', 'accounts.challenge', ['attempt' => $attemptId])->assertOk();

        $this->assertSame($address, $read->json('address'));
        $this->assertStringContainsString('no-store', (string) $read->headers->get('Cache-Control'));
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner()->user('Member');

        return RouteCall::as(Caller::User)
            ->parameters([
                'attempt' => strtolower((string) Str::ulid()),
            ])
            ->hiddenFrom('Member');
    }
}
