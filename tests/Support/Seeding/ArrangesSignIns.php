<?php

declare(strict_types=1);

namespace Tests\Support\Seeding;

use App\Accounts\Commands\BeginSignIn\BeginSignInCommand;
use App\Accounts\Commands\BeginSignInAgain\BeginSignInAgainCommand;
use App\Accounts\Commands\SubmitSignInCode\SubmitSignInCodeCommand;
use App\Accounts\Enums\SignInMethod;
use App\Accounts\SignInChallenges;
use App\Models\Accounts\Account;
use App\Values\SignInChallenge;
use Illuminate\Contracts\Config\Repository;
use Illuminate\Support\Facades\Facade;
use PHPUnit\Framework\Assert;
use Tests\Support\Seeding\Exceptions\FixtureRefused;

/**
 * The sign-ins a test's owner begins, each under a name of its own, with the challenge each showed the owner, so
 * the journal's facts read them by that name.
 */
trait ArrangesSignIns
{
    /**
     * @var array<string, string> each sign-in attempt the test began, by the name it gave it
     */
    private array $signIns = [];

    /**
     * @var array<string, SignInChallenge> the challenge each named sign-in showed the owner
     */
    private array $signInChallenges = [];

    /**
     * The owner's sign-ins are made as a running host makes them: through the cache the served journal and its runner
     * share, each attempt's folder under the accounts folder given.
     */
    public function shareSignIns(string $accountsFolder): self
    {
        $this->app->make(Repository::class)->set(['cache.default' => 'file', 'accounts.root' => $accountsFolder]);
        $this->app->forgetInstance('cache');
        $this->app->forgetInstance('cache.store');
        Facade::clearResolvedInstance('cache');

        return $this;
    }

    /**
     * The owner begins a sign-in of the driver, which the test calls by the name.
     */
    public function beginSignIn(string $name, string $driver, SignInMethod $method = SignInMethod::OAuth): self
    {
        $this->assertSignInNameFree($name);
        $this->signIns[$name] = $this->asOwner(new BeginSignInCommand($driver, $method))->attemptId;

        return $this;
    }

    /**
     * The owner signs the account in again, a sign-in the test calls by the name.
     */
    public function beginSignInAgain(string $name, Account $account): self
    {
        $this->assertSignInNameFree($name);
        $this->signIns[$name] = $this->asOwner(new BeginSignInAgainCommand($account->id))->attemptId;

        return $this;
    }

    /**
     * Waits up to the seconds for the challenge a host's runner published for the named sign-in, and keeps it.
     */
    public function awaitSignInChallenge(string $name, int $seconds = 20): self
    {
        $attemptId = $this->signInCalled($name);
        $challenges = $this->app->make(SignInChallenges::class);
        $deadline = microtime(true) + $seconds;

        while ($challenges->challengeOf($attemptId) === null && microtime(true) < $deadline) {
            usleep(100_000);
        }

        $challenge = $challenges->challengeOf($attemptId);
        Assert::assertNotNull($challenge, "The sign-in {$name} showed no challenge in {$seconds} seconds.");
        $this->signInChallenges[$name] = $challenge;

        return $this;
    }

    /**
     * The owner types the code the named sign-in's challenge asked for, under the submission key.
     */
    public function submitSignInCode(string $name, string $code, string $submissionKey): self
    {
        $this->asOwner(new SubmitSignInCodeCommand($this->signInCalled($name), $code, $submissionKey));

        return $this;
    }

    /**
     * The attempt id of the sign-in the test began under the name.
     */
    public function signInCalled(string $name): string
    {
        return $this->signIns[$name] ?? throw FixtureRefused::missingAlias('sign-in', $name, self::OWNER);
    }

    private function assertSignInNameFree(string $name): void
    {
        if (array_key_exists($name, $this->signIns)) {
            throw FixtureRefused::occupiedAlias($name, 'sign-in');
        }
    }
}
