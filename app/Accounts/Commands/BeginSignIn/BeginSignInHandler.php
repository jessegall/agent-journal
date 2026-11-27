<?php

declare(strict_types=1);

namespace App\Accounts\Commands\BeginSignIn;

use App\Accounts\Exceptions\SignInMethodMissing;
use App\Accounts\SignInProtocols;
use App\Accounts\Values\SignInStarted;
use App\Bus\Contracts\CommandHandler;
use App\Jobs\SignInDeadline;
use App\Models\Accounts\ActiveAccount;
use App\Models\Accounts\SignInAttempt;
use Carbon\CarbonImmutable;
use Illuminate\Container\Attributes\Config;
use Illuminate\Contracts\Bus\Dispatcher as JobDispatcher;

/**
 * Starts or rejoins a new account's sign-in under the driver's selection lock: one attempt at a time writes a new
 * folder. The attempt and its deadline are saved before its deadline job is queued, after commit, with ids only.
 */
final readonly class BeginSignInHandler implements CommandHandler
{
    public function __construct(
        private SignInProtocols $protocols,
        #[Config('journal.accounts.sign_in_minutes')]
        private int $signInMinutes,
        #[Config('journal.accounts.root')]
        private string $accountsRoot,
        private JobDispatcher $jobs,
    ) {}

    public function handle(BeginSignInCommand $command): SignInStarted
    {
        $driver = $command->driver;

        if (! $this->protocols->supports($driver, $command->method)) {
            throw SignInMethodMissing::for($driver, $command->method->value);
        }

        ActiveAccount::findLockedFor($driver);
        $running = SignInAttempt::findLiveFor($driver, null);

        if ($running !== null) {
            return new SignInStarted($running->id, true);
        }

        $expiresAt = CarbonImmutable::now()->addMinutes($this->signInMinutes);
        $directory = SignInAttempt::resolveNewFolderIn($this->accountsRoot);

        $attempt = SignInAttempt::create(
            $command->dispatchedBy(),
            $driver,
            $command->method,
            $directory,
            $expiresAt,
        );

        $this->jobs->dispatch(new SignInDeadline($attempt->id)->afterCommit()->delay($attempt->expires_at));

        return new SignInStarted($attempt->id, false);
    }
}
