<?php

declare(strict_types=1);

namespace App\Profiles\Handlers;

use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandHandler;
use App\Profiles\Commands\BeginSignIn;
use App\Profiles\Exceptions\SignInMethodMissing;
use App\Profiles\Jobs\SignInDeadline;
use App\Profiles\Models\ActiveAccount;
use App\Profiles\Models\SignInAttempt;
use App\Profiles\Support\SignInProtocols;
use App\Profiles\Values\SignInStarted;
use App\Programs\Enums\HookProgram;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Bus\Dispatcher as JobDispatcher;
use Illuminate\Contracts\Config\Repository;

/**
 * Starts or rejoins a new account's sign-in under the program's selection lock: one attempt at a time writes a new
 * folder. The attempt and its deadline are saved before its deadline job is queued, after commit, with ids only.
 */
final readonly class BeginSignInHandler implements CommandHandler
{
    public function __construct(
        private SignInProtocols $protocols,
        private Repository $config,
        private JobDispatcher $jobs,
    ) {}

    public function handle(BeginSignIn $command): SignInStarted
    {
        $repeated = SignInAttempt::withRequestKey($command->requestKey);

        if ($repeated !== null) {
            return new SignInStarted($repeated->id, true);
        }

        $program = HookProgram::from($command->program);

        if (! $this->protocols->supports($program->value, $command->method)) {
            throw SignInMethodMissing::for($program->value, $command->method->value);
        }

        ActiveAccount::lockedFor($program);
        $running = SignInAttempt::liveFor($program, null);

        if ($running !== null) {
            return new SignInStarted($running->id, true);
        }

        $expiresAt = CarbonImmutable::now()->addMinutes($this->config->integer('accounts.sign_in_minutes'));
        $directory = SignInAttempt::newFolderIn($this->config->string('accounts.root'));
        $attempt = SignInAttempt::create(
            ActorIdentity::of($command->dispatchedBy()),
            $program,
            $command->method,
            $directory,
            $command->requestKey,
            $expiresAt,
        );
        $this->jobs->dispatch(new SignInDeadline($attempt->id)->afterCommit()->delay($attempt->expires_at));

        return new SignInStarted($attempt->id, false);
    }
}
