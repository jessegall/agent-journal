<?php

declare(strict_types=1);

namespace App\Profiles\Commands\BeginSignIn;

use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandHandler;
use App\Drivers\Enums\HookDriver;
use App\Profiles\Exceptions\SignInMethodMissing;
use App\Profiles\Jobs\SignInDeadline;
use App\Profiles\Models\ActiveAccount;
use App\Profiles\Models\SignInAttempt;
use App\Profiles\Support\SignInProtocols;
use App\Profiles\Values\SignInStarted;
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
        $driver = HookDriver::from($command->driver);

        if (! $this->protocols->supports($driver->value, $command->method)) {
            throw SignInMethodMissing::for($driver->value, $command->method->value);
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
