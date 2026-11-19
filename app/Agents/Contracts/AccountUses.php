<?php

declare(strict_types=1);

namespace App\Agents\Contracts;

use App\Actors\Exceptions\ActorNotAllowed;
use App\Agents\Exceptions\AccountUseMissing;
use App\Agents\Support\AccountUse;
use App\Agents\Support\AccountUseCounts;
use App\Records\Support\RecordIdentity;

/**
 * What the starts did with the accounts, by the accounts' identities alone: how many run on each, the starts one
 * account ran, and the account a session ran with. Only an actor granted the read may ask.
 */
interface AccountUses
{
    /**
     * @param  list<RecordIdentity>  $accounts
     *
     * @throws ActorNotAllowed
     */
    public function counts(array $accounts): AccountUseCounts;

    /**
     * The starts that used the account, newest first.
     *
     * @return list<AccountUse>
     *
     * @throws ActorNotAllowed
     */
    public function history(RecordIdentity $account, int $limit): array;

    /**
     * The account of the given link alias the session ran with, for handling a failure it reported.
     *
     * @throws ActorNotAllowed|AccountUseMissing
     */
    public function accountOf(string $sessionId, string $accountType): RecordIdentity;
}
