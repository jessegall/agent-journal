<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Authorization\Policy;
use App\Contracts\Authorization\SystemEntryPolicies as SystemEntryPoliciesContract;

/**
 * The policies the system may act on through each trusted entry: every entry starts with none, and the area whose
 * commands run under an entry adds the policies those commands need.
 */
final class SystemEntryPolicies implements SystemEntryPoliciesContract
{
    /**
     * @var array<string, list<class-string<Policy>>>
     */
    private array $policies = [
        'host request' => [],
        'host enrolment' => [],
        'process reconcile' => [],
        'share read' => [],
        'sharing supervisor' => [],
        'skill publishing' => [],
        'skill refresh' => [],
        'built-in profiles' => [],
        'number install' => [],
        'desk install' => [],
        'main agent install' => [],
        'driver switch' => [],
        'account reconciliation' => [],
    ];

    /**
     * @param  class-string<Policy>  $policy
     */
    public function allow(string $entry, string $policy): void
    {
        $this->policies[$entry][] = $policy;
    }

    public function has(string $entry): bool
    {
        return array_key_exists($entry, $this->policies);
    }

    /**
     * @return list<class-string<Policy>>
     */
    public function of(string $entry): array
    {
        return $this->policies[$entry];
    }
}
