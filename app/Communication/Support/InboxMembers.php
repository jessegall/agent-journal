<?php

declare(strict_types=1);

namespace App\Communication\Support;

use App\Communication\Exceptions\InboxProviderInvalid;

/**
 * The members of one inbox, loaded once and never more than a hundred.
 */
final readonly class InboxMembers
{
    public const int LIMIT = 100;

    /**
     * @param  list<InboxMembership>  $memberships
     *
     * @throws InboxProviderInvalid
     */
    public function __construct(public array $memberships)
    {
        if (count($memberships) > self::LIMIT) {
            throw InboxProviderInvalid::tooManyMembers(count($memberships));
        }
    }
}
