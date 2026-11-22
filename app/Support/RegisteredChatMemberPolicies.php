<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Authorization\Policy;
use App\Contracts\Chat\ChatMemberPolicies;

/**
 * The policies a chat member may be granted at all, each registered by the domain that owns it: reading, posting,
 * pinning, docking and changing members of the chats it is in. Every other policy refuses a chat member.
 */
final class RegisteredChatMemberPolicies implements ChatMemberPolicies
{
    /**
     * @var array<class-string<Policy>, true>
     */
    private array $policies = [];

    /**
     * @param  class-string<Policy>  $policy
     */
    public function allow(string $policy): void
    {
        $this->policies[$policy] = true;
    }

    public function allows(string $policy): bool
    {
        return array_key_exists($policy, $this->policies);
    }
}
