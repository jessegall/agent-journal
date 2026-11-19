<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Profiles\Enums\SignInState;
use App\Profiles\Events\AccountsChanged;
use App\Profiles\Exceptions\SignInAttemptStale;
use App\Profiles\Models\Account;
use App\Profiles\Models\ActiveAccount;
use App\Profiles\Models\SignInAttempt;
use App\Profiles\Values\AccountLabel;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Saves a verified sign-in once: under the program's selection lock, then the attempt's, it rechecks the attempt is
 * live, within its deadline and in the generation the host ran in, then makes or signs in the account. The program's
 * first account becomes the one its launches use.
 */
final readonly class SignInCompletion
{
    public function __construct(private Dispatcher $events) {}

    /**
     * @throws SignInAttemptStale
     */
    public function complete(string $attemptId, int $generation, string|null $identity): void
    {
        $now = CarbonImmutable::now();
        $program = SignInAttempt::programForJournal($attemptId);
        $selection = ActiveAccount::lockedForJournal($program);
        $attempt = SignInAttempt::lockedForJournal($attemptId);

        if (! $attempt->accepts($generation, $now)) {
            throw SignInAttemptStale::for($attempt->id);
        }

        $account = $attempt->account_id === null
            ? Account::signedIn($program, AccountLabel::from((string) $attempt->label), (string) $attempt->directory)
            : Account::lockedForJournal($attempt->account_id);
        $account->signedInAgain($attempt, $identity, $now);
        $attempt->end(SignInState::Complete);
        $selection->chooseFirst($account);
        $this->events->dispatch(new AccountsChanged($attempt->program, $account->id));
    }
}
