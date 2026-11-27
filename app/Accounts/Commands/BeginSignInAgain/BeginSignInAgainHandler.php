<?php

declare(strict_types=1);

namespace App\Accounts\Commands\BeginSignInAgain;

use App\Accounts\Contracts\AccountUses;
use App\Accounts\Values\SignInStarted;
use App\Bus\Contracts\CommandHandler;
use App\Jobs\SignInDeadline;
use App\Models\Accounts\Account;
use App\Models\Accounts\ActiveAccount;
use App\Models\Accounts\SignInAttempt;
use Carbon\CarbonImmutable;
use Illuminate\Container\Attributes\Config;
use Illuminate\Contracts\Bus\Dispatcher as JobDispatcher;

/**
 * Starts or rejoins a sign-in again under the driver's selection lock, then the account's: the account is held so no
 * new start starts on it, the attempt becomes the folder's one writer in a new sign-in generation, and a host may
 * take it at once only when no process runs on the account; otherwise the account sweep lets it go once they ended.
 */
final readonly class BeginSignInAgainHandler implements CommandHandler
{
    public function __construct(
        #[Config('accounts.sign_in_minutes')]
        private int $signInMinutes,
        #[Config('accounts.root')]
        private string $accountsRoot,
        private JobDispatcher $jobs,
        private AccountUses $uses,
    ) {}

    public function handle(BeginSignInAgainCommand $command): SignInStarted
    {
        $driver = Account::resolveDriverOf($command->accountId);
        ActiveAccount::findLockedFor($driver);
        $account = Account::findLockedForChange($command->accountId);
        $running = SignInAttempt::findLiveFor($driver, $account);

        if ($running !== null) {
            return new SignInStarted($running->id, true);
        }

        $account->holdForMaintenance();
        $expiresAt = CarbonImmutable::now()->addMinutes($this->signInMinutes);
        $directory = SignInAttempt::resolveNewFolderIn($this->accountsRoot);

        $attempt = SignInAttempt::create(
            $command->dispatchedBy(),
            $account,
            $account->method,
            $directory,
            $expiresAt,
        );

        $account->writerFor($attempt);
        $attempt->writeInGeneration($account->sign_in_generation);

        if ($this->uses->counts([$account->recordIdentity])->isEmpty()) {
            $attempt->releaseForHost();
        }

        $this->jobs->dispatch(new SignInDeadline($attempt->id)->afterCommit()->delay($attempt->expires_at));

        return new SignInStarted($attempt->id, false);
    }
}
