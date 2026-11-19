<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Records\Support\RecordIdentity;

/**
 * The launches still running on a held account, by session, each of which must end before its sign-in changes.
 */
final readonly class HeldAccountUses
{
    /**
     * @param  list<string>  $sessionIds
     */
    public function __construct(
        public RecordIdentity $account,
        public array $sessionIds,
    ) {}
}
