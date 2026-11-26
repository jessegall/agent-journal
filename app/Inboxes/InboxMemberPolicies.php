<?php

declare(strict_types=1);

namespace App\Inboxes;

use App\Access\Contracts\Policy;
use App\Inboxes\Contracts\InboxMemberPolicies as InboxMemberPoliciesContract;

/**
 * The policies an inbox member may be granted at all, each registered by the domain that owns it: reading, posting,
 * pinning, docking and changing members of the inboxes it is in. Every other policy refuses an inbox member.
 */
final class InboxMemberPolicies implements InboxMemberPoliciesContract
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
