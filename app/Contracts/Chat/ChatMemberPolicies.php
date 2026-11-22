<?php

declare(strict_types=1);

namespace App\Contracts\Chat;

use App\Contracts\Authorization\Policy;

/**
 * The policies a chat member may be granted at all, each named by the domain that owns it; every other policy
 * refuses a chat member.
 */
interface ChatMemberPolicies
{
    /**
     * @param  class-string<Policy>  $policy
     */
    public function allow(string $policy): void;

    public function allows(string $policy): bool;
}
