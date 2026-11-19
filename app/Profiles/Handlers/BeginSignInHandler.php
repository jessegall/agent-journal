<?php

declare(strict_types=1);

namespace App\Profiles\Handlers;

use App\Contracts\CommandHandler;
use App\Profiles\Commands\BeginSignIn;
use App\Profiles\Events\AccountsChanged;
use App\Profiles\Jobs\SignInDeadline;
use App\Profiles\Models\ActiveAccount;
use App\Profiles\Models\SignInAttempt;
use App\Profiles\Values\AccountLabel;
use App\Profiles\Values\SignInStarted;
use App\Programs\Enums\HookProgram;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Bus\Dispatcher as JobDispatcher;
use Illuminate\Contracts\Config\Repository;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\Str;

/**
 * Starts or rejoins a new account's sign-in under the program's selection lock: one attempt at a time writes a new
 * folder. The attempt and its deadline are saved before its deadline job is queued, after commit, with ids only.
 */
final readonly class BeginSignInHandler implements CommandHandler
{
    public function __construct(
        private Repository $config,
        private Dispatcher $events,
        private JobDispatcher $jobs,
    ) {}

    public function handle(BeginSignIn $command): SignInStarted
    {
        $repeated = SignInAttempt::withRequestKey($command->requestKey);

        if ($repeated !== null) {
            return new SignInStarted($repeated->id, true);
        }

        $program = HookProgram::from($command->program);
        ActiveAccount::lockedFor($program);
        $running = SignInAttempt::liveFor($program, null);

        if ($running !== null) {
            return new SignInStarted($running->id, true);
        }

        $expiresAt = CarbonImmutable::now()->addMinutes($this->config->integer('accounts.sign_in_minutes'));
        $label = AccountLabel::from($command->label);
        $directory = $this->config->string('accounts.root').'/'.Str::lower((string) Str::ulid());
        $attempt = SignInAttempt::forNewAccount($program, $label, $directory, $command->requestKey, $expiresAt);
        $this->jobs->dispatch(new SignInDeadline($attempt->id)->afterCommit()->delay($attempt->expires_at));
        $this->events->dispatch(new AccountsChanged($program->value, $attempt->id));

        return new SignInStarted($attempt->id, false);
    }
}
