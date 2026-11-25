<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Authorization\TargetAuthorizer;
use App\Contracts\Bus\CommandFacts;
use App\Contracts\Drivers\DriverCatalogue;
use App\Enums\Accounts\SignInStatus;
use App\Enums\Agents\AccessType;
use App\Exceptions\ActorUnavailable;
use App\Exceptions\SignInAttemptStale;
use App\Models\Accounts\Account;
use App\Models\Accounts\ActiveAccount;
use App\Models\Accounts\SignInAttempt;
use App\Policies\AccountPolicy;
use App\Values\AccountLabel;
use App\Values\SignInIdentity;
use Carbon\CarbonImmutable;

/**
 * Saves a verified sign-in once: under the driver's selection lock, then the attempt's, it rechecks the attempt is
 * live, within its deadline and in the generation the host ran in, then makes or signs in the account. The driver's
 * first account becomes the one its starts use.
 */
final readonly class SignInCompletion
{
    public function __construct(
        private TargetAuthorizer $authorizer,
        private AccountNotices $notices,
        private CommandFacts $facts,
        private DriverCatalogue $drivers,
    ) {}

    /**
     * @throws SignInAttemptStale
     */
    public function complete(string $attemptId, int $generation, SignInIdentity $identity): void
    {
        $now = CarbonImmutable::now();
        $driver = SignInAttempt::resolveDriverForJournal($attemptId);
        $selection = ActiveAccount::findLockedForJournal($driver);
        $attempt = SignInAttempt::findLockedForJournal($attemptId);

        if ($attempt->isPublishedIn($generation)) {
            return;
        }

        if ($attempt->isLive() && $attempt->isExpiredAt($now)) {
            $this->endWithout($attempt, SignInStatus::Expired, $now);

            return;
        }

        if (! $attempt->accepts($generation, $now)) {
            throw SignInAttemptStale::for($attempt->id);
        }

        if (! $this->isStarterMayStillAdd($attempt)) {
            $this->endWithout($attempt, SignInStatus::Failed, $now);

            return;
        }

        $staging = (string) $attempt->directory;

        $holder = Account::findHoldingKeyOf($attempt)
            ?? ($attempt->account_id === null ? Account::findHoldingPrincipal($driver, $identity) : null);

        if ($holder !== null) {
            $attempt->finishMatching($holder);
            $this->facts->runTransactionListeners();

            return;
        }

        if ($attempt->account_id === null) {
            $fallback = $attempt->method->accountNameFor($this->drivers->family($driver)->label);
            $proposed = AccountLabel::proposedFrom($identity->display, $fallback);
            $account = Account::create($driver, Account::resolveFreeLabel($driver, $proposed), $staging);
            $attempt->completeWith($account);
        } else {
            $account = Account::findLockedForJournal($attempt->account_id);

            if (! $attempt->method->isSecret() && ! $account->canCompareWith($identity)) {
                $this->endWithout($attempt, SignInStatus::Unverified, $now);

                return;
            }

            if (! $attempt->method->isSecret() && ! $account->isSamePrincipal($identity)) {
                $this->endWithout($attempt, SignInStatus::DifferentAccount, $now);

                return;
            }

            $attempt->displace($account);
        }

        $account->signedInAgain($attempt, $identity, $staging, $now);
        $selection->chooseFirst($account);
        $this->notices->resolveOpen($driver, $now);
    }

    /**
     * Whether the actor that started the attempt still holds the grant to add accounts, read from its own authority
     * now, not from the host's signature; a starter that is no longer an actor, such as a user the journal no longer
     * admits, holds none.
     */
    private function isStarterMayStillAdd(SignInAttempt $attempt): bool
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
     * An attempt that publishes nothing, as a different account, a starter without the grant or one past its deadline:
     * it ends in that state, its staging folder is cleaned, and a reconnected account keeps its saved folder and login.
     */
    private function endWithout(SignInAttempt $attempt, SignInStatus $state, CarbonImmutable $now): void
    {
        $attempt->finishAt($state, $now);
        $this->facts->runTransactionListeners();
    }
}
