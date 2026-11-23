<?php

declare(strict_types=1);

namespace App\Commands\BeginSignIn;

use App\Contracts\Bus\CommandHandler;
use App\Exceptions\SignInMethodMissing;
use App\Jobs\SignInDeadline;
use App\Models\Accounts\ActiveAccount;
use App\Models\Accounts\SignInAttempt;
use App\Support\ActorIdentity;
use App\Support\SignInProtocols;
use App\Values\SignInStarted;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Bus\Dispatcher as JobDispatcher;
use Illuminate\Contracts\Config\Repository;

/**
 * Starts or rejoins a new account's sign-in under the driver's selection lock: one attempt at a time writes a new
 * folder. The attempt and its deadline are saved before its deadline job is queued, after commit, with ids only.
 */
final readonly class BeginSignInHandler implements CommandHandler
{
    public function __construct(
        private SignInProtocols $protocols,
        private Repository $config,
        private JobDispatcher $jobs,
    ) {}

    public function handle(BeginSignInCommand $command): SignInStarted
    {
        $driver = $command->driver;

        if (! $this->protocols->supports($driver, $command->method)) {
            throw SignInMethodMissing::for($driver, $command->method->value);
        }

        ActiveAccount::lockedFor($driver);
        $running = SignInAttempt::liveFor($driver, null);

        if ($running !== null) {
            return new SignInStarted($running->id, true);
        }

        $expiresAt = CarbonImmutable::now()->addMinutes($this->config->integer('accounts.sign_in_minutes'));
        $directory = SignInAttempt::newFolderIn($this->config->string('accounts.root'));

        $attempt = SignInAttempt::create(
            ActorIdentity::of($command->dispatchedBy()),
            $driver,
            $command->method,
            $directory,
            $expiresAt,
        );

        $this->jobs->dispatch(new SignInDeadline($attempt->id)->afterCommit()->delay($attempt->expires_at));

        return new SignInStarted($attempt->id, false);
    }
}
