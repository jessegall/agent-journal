<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Enums\AgentRole;
use App\Agents\Enums\ExecutionModeType;
use App\Agents\Exceptions\ExecutionPolicyInvalid;

/**
 * Where and with what one launch runs: host or required container, the verified image a container uses, its
 * worktree, its budgets and the network capabilities it was admitted with. It holds no provider or journal secret.
 */
final readonly class ExecutionPolicy
{
    /**
     * @param  string|null  $imageReference  the verified image by digest; null exactly on the protected host
     * @param  list<string>  $networkCapabilities
     */
    private function __construct(
        public ExecutionModeType $mode,
        public string|null $imageReference,
        public string $worktree,
        public ExecutionBudgets $budgets,
        public array $networkCapabilities,
    ) {}

    /**
     * A writing helper always runs in a required container, and a container always names its verified image.
     *
     * @param  list<string>  $networkCapabilities
     *
     * @throws ExecutionPolicyInvalid
     */
    public static function make(AgentRole $role, ExecutionModeType $mode, string|null $imageReference, string $worktree, ExecutionBudgets $budgets, array $networkCapabilities): self
    {
        if ($role === AgentRole::WritingHelper && $mode !== ExecutionModeType::RequiredContainer) {
            throw ExecutionPolicyInvalid::containerRequired($role);
        }

        if ($mode === ExecutionModeType::RequiredContainer && $imageReference === null) {
            throw ExecutionPolicyInvalid::imageMissing();
        }

        return new self($mode, $imageReference, $worktree, $budgets, $networkCapabilities);
    }
}
