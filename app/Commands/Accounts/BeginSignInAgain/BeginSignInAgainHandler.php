<?php

declare(strict_types=1);

namespace App\Commands\Accounts\BeginSignInAgain;

use App\Contracts\Accounts\AccountUses;
use App\Contracts\Bus\CommandHandler;
use App\Jobs\SignInDeadline;
use App\Models\Accounts\Account;
use App\Models\Accounts\ActiveAccount;
use App\Models\Accounts\SignInAttempt;
use App\Support\ActorIdentity;
use App\Values\SignInStarted;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Bus\Dispatcher as JobDispatcher;
use Illuminate\Contracts\Config\Repository;

/**
 * Starts or rejoins a sign-in again under the driver's selection lock, then the account's: the account is held so no
 * new start starts on it, the attempt becomes the folder's one writer in a new sign-in generation, and a host may
 * take it at once only when no process runs on the account; otherwise the account sweep lets it go once they ended.
 */
final readonly class BeginSignInAgainHandler implements CommandHandler
{
    public function __construct(
        private Repository $config,
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
        $expiresAt = CarbonImmutable::now()->addMinutes($this->config->integer('accounts.sign_in_minutes'));
        $directory = SignInAttempt::resolveNewFolderIn($this->config->string('accounts.root'));

        $attempt = SignInAttempt::create(
            ActorIdentity::of($command->dispatchedBy()),
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
