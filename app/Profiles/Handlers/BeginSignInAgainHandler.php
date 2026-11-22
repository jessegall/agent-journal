<?php

declare(strict_types=1);

namespace App\Profiles\Handlers;

use App\Actors\Support\ActorIdentity;
use App\Agents\Contracts\AccountUses;
use App\Contracts\CommandHandler;
use App\Profiles\Commands\BeginSignInAgain;
use App\Profiles\Jobs\SignInDeadline;
use App\Profiles\Models\Account;
use App\Profiles\Models\ActiveAccount;
use App\Profiles\Models\SignInAttempt;
use App\Profiles\Values\SignInStarted;
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

    public function handle(BeginSignInAgain $command): SignInStarted
    {
        $driver = Account::driverOf($command->accountId);
        ActiveAccount::lockedFor($driver);
        $account = Account::lockedForChange($command->accountId);
        $running = SignInAttempt::liveFor($driver, $account);

        if ($running !== null) {
            return new SignInStarted($running->id, true);
        }

        $account->holdForMaintenance();
        $expiresAt = CarbonImmutable::now()->addMinutes($this->config->integer('accounts.sign_in_minutes'));
        $directory = SignInAttempt::newFolderIn($this->config->string('accounts.root'));

        $attempt = SignInAttempt::create(
            ActorIdentity::of($command->dispatchedBy()),
            $account,
            $account->method,
            $directory,
            $expiresAt,
        );

        $account->writerFor($attempt);
        $attempt->writeInGeneration($account->sign_in_generation);

        if ($this->uses->counts([$account->recordIdentity()])->isEmpty()) {
            $attempt->releaseForHost();
        }

        $this->jobs->dispatch(new SignInDeadline($attempt->id)->afterCommit()->delay($attempt->expires_at));

        return new SignInStarted($attempt->id, false);
    }
}
