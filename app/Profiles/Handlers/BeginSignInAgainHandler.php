<?php

declare(strict_types=1);

namespace App\Profiles\Handlers;

use App\Agents\Contracts\AccountUses;
use App\Contracts\CommandHandler;
use App\Profiles\Commands\BeginSignInAgain;
use App\Profiles\Enums\SignInMethod;
use App\Profiles\Events\AccountsChanged;
use App\Profiles\Jobs\SignInDeadline;
use App\Profiles\Models\Account;
use App\Profiles\Models\ActiveAccount;
use App\Profiles\Models\SignInAttempt;
use App\Profiles\Values\SignInStarted;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Bus\Dispatcher as JobDispatcher;
use Illuminate\Contracts\Config\Repository;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Starts or rejoins a sign-in again under the program's selection lock, then the account's: the account is held so no
 * new start starts on it, the attempt becomes the folder's one writer in a new sign-in generation, and a host may
 * take it at once only when no process runs on the account; otherwise the account sweep lets it go once they ended.
 */
final readonly class BeginSignInAgainHandler implements CommandHandler
{
    /**
     * A reconnect signs in again by OAuth until the account records the method it was added by.
     */
    private const SignInMethod METHOD = SignInMethod::OAuth;

    public function __construct(
        private Repository $config,
        private Dispatcher $events,
        private JobDispatcher $jobs,
        private AccountUses $uses,
    ) {}

    public function handle(BeginSignInAgain $command): SignInStarted
    {
        $repeated = SignInAttempt::withRequestKey($command->requestKey);

        if ($repeated !== null) {
            return new SignInStarted($repeated->id, true);
        }

        $program = Account::programOf($command->accountId);
        ActiveAccount::lockedFor($program);
        $account = Account::lockedForChange($command->accountId);
        $running = SignInAttempt::liveFor($program, $account);

        if ($running !== null) {
            return new SignInStarted($running->id, true);
        }

        $account->holdForMaintenance();
        $expiresAt = CarbonImmutable::now()->addMinutes($this->config->integer('accounts.sign_in_minutes'));
        $attempt = SignInAttempt::forAccount($account, self::METHOD, $command->requestKey, $expiresAt);
        $attempt->writeFolderOf($account);

        if ($this->uses->counts([$account->recordIdentity()])->isEmpty()) {
            $attempt->releaseForHost();
        }

        $this->jobs->dispatch(new SignInDeadline($attempt->id)->afterCommit()->delay($attempt->expires_at));
        $this->events->dispatch(new AccountsChanged($program->value, $account->id));

        return new SignInStarted($attempt->id, false);
    }
}
