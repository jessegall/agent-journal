<?php

declare(strict_types=1);

namespace App\Agents\Values;

use App\Agents\Enums\ExecutionModeType;
use App\Agents\Exceptions\ExecutionPolicyInvalid;

/**
 * Where and with what one start runs: host or required container, the verified image a container uses, its
 * worktree, its budgets and the network capabilities it was admitted with. It holds no provider or journal secret.
 */
final readonly class ExecutionPolicy
{
    /**
     * @param  string|null  $imageReference  the verified image by digest; null exactly on the protected host
     * @param  list<string>  $networkCapabilities
     * @param  bool  $attachable  whether a contained start's program is its container's own terminal process
     */
    private function __construct(
        public ExecutionModeType $mode,
        public string|null $imageReference,
        public string $worktree,
        public ExecutionBudgets $budgets,
        public array $networkCapabilities,
        public bool $attachable,
    ) {}

    /**
     * A container always names its verified image.
     *
     * @param  list<string>  $networkCapabilities
     *
     * @throws ExecutionPolicyInvalid
     */
    public static function make(
        ExecutionModeType $mode,
        string|null $imageReference,
        string $worktree,
        ExecutionBudgets $budgets,
        array $networkCapabilities,
        bool $attachable = false,
    ): self {
        if ($mode === ExecutionModeType::RequiredContainer && $imageReference === null) {
            throw ExecutionPolicyInvalid::imageMissing();
        }

        return new self($mode, $imageReference, $worktree, $budgets, $networkCapabilities, $attachable);
    }
}
