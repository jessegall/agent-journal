<?php

declare(strict_types=1);

namespace App\Inboxes\Contracts;

use App\Access\Contracts\Policy;

/**
 * The policies an inbox member may be granted at all, each named by the domain that owns it; every other policy
 * refuses an inbox member.
 */
interface InboxMemberPolicies
{
    /**
     * @param  class-string<Policy>  $policy
     */
    public function allow(string $policy): void;

    /**
     * Whether the inbox member policy of that name is switched on.
     */
    public function allows(string $policy): bool;
}
