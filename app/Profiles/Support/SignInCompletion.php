<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Actors\Contracts\TargetAuthorizer;
use App\Actors\Exceptions\ActorUnavailable;
use App\Bus\Contracts\CommandFacts;
use App\Operations\Enums\AccessType;
use App\Profiles\Enums\SignInState;
use App\Profiles\Exceptions\SignInAttemptStale;
use App\Profiles\Models\Account;
use App\Profiles\Models\ActiveAccount;
use App\Profiles\Models\SignInAttempt;
use App\Profiles\Policies\AccountPolicy;
use App\Profiles\Values\AccountLabel;
use App\Profiles\Values\SignInIdentity;
use Carbon\CarbonImmutable;

/**
 * Saves a verified sign-in once: under the program's selection lock, then the attempt's, it rechecks the attempt is
 * live, within its deadline and in the generation the host ran in, then makes or signs in the account. The program's
 * first account becomes the one its starts use.
 */
final readonly class SignInCompletion
{
    public function __construct(
        private TargetAuthorizer $authorizer,
        private AccountNotices $notices,
        private CommandFacts $facts,
    ) {}

    /**
     * @throws SignInAttemptStale
     */
    public function complete(string $attemptId, int $generation, SignInIdentity $identity): void
    {
        $now = CarbonImmutable::now();
        $driver = SignInAttempt::driverForJournal($attemptId);
        $selection = ActiveAccount::lockedForJournal($driver);
        $attempt = SignInAttempt::lockedForJournal($attemptId);

        if ($attempt->isPublishedIn($generation)) {
            return;
        }

        if (! $attempt->accepts($generation, $now)) {
            throw SignInAttemptStale::for($attempt->id);
        }

        if (! $this->starterMayStillAdd($attempt)) {
            $this->endWithout($attempt, SignInState::Failed);

            return;
        }

        $staging = (string) $attempt->directory;

        if (Account::holdsKeyOf($attempt)) {
            $this->endWithout($attempt, SignInState::AlreadyAdded);

            return;
        }

        if ($attempt->account_id === null) {
            if (Account::holdingPrincipal($driver, $identity) !== null) {
                $this->endWithout($attempt, SignInState::AlreadyAdded);

                return;
            }

            $fallback = $attempt->method->accountNameFor($driver->displayName());
            $proposed = AccountLabel::proposedFrom($identity->display, $fallback);
            $account = Account::create($driver, Account::freeLabel($driver, $proposed), $staging);
            $attempt->end(SignInState::Complete);
        } else {
            $account = Account::lockedForJournal($attempt->account_id);

            if (! $attempt->method->isSecret() && ! $account->isSamePrincipal($identity)) {
                $this->endWithout($attempt, SignInState::DifferentAccount);

                return;
            }

            $attempt->displace((string) $account->directory);
        }

        $account->signedInAgain($attempt, $identity, $staging, $now);
        $selection->chooseFirst($account);
        $this->notices->resolveOpen($driver->value, $now);
    }

    /**
     * Whether the actor that started the attempt still holds the grant to add accounts, read from its own authority
     * now, not from the host's signature; a starter that is no longer an actor, such as a user the journal no longer
     * admits, holds none.
     */
    private function starterMayStillAdd(SignInAttempt $attempt): bool
    {
        try {
            $accesses = $this->authorizer->filterActions(
                $attempt->actor(),
                AccountPolicy::class,
                Account::class,
                [AccessType::Create],
            );
        } catch (ActorUnavailable) {
            return false;
        }

        return $accesses !== [];
    }

    /**
     * An attempt that publishes nothing, as a different account, a key already added or a starter without the grant:
     * it ends in that state, its staging folder is cleaned, and a reconnected account keeps its saved folder and login.
     */
    private function endWithout(SignInAttempt $attempt, SignInState $state): void
    {
        $attempt->finish($state);
        $this->facts->applyRequired();
    }
}
