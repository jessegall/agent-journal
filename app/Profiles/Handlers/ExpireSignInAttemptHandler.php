<?php

declare(strict_types=1);

namespace App\Profiles\Handlers;

use App\Contracts\CommandHandler;
use App\Profiles\Commands\ExpireSignInAttempt;
use App\Profiles\Enums\SignInState;
use App\Profiles\Events\AccountsChanged;
use App\Profiles\Models\SignInAttempt;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Events\Dispatcher;

final readonly class ExpireSignInAttemptHandler implements CommandHandler
{
    public function __construct(private Dispatcher $events) {}

    public function handle(ExpireSignInAttempt $command): bool
    {
        $attempt = SignInAttempt::lockedForJournal($command->attemptId);

        if (! $attempt->isLive() || ! $attempt->isExpiredAt(CarbonImmutable::now())) {
            return false;
        }

        $attempt->finish(SignInState::Expired);
        $this->events->dispatch(new AccountsChanged($attempt->program, $attempt->account_id ?? $attempt->id));

        return true;
    }
}
