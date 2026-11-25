<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\ExecutionModeType;
use App\Exceptions\ExecutionPolicyInvalid;
use Spatie\LaravelData\Data;

/**
 * Where and with what one start runs: host or required container, the verified image a container uses, its
 * worktree, its budgets and the network capabilities it was admitted with. It holds no provider or journal secret.
 */
final class ExecutionPolicy extends Data
{
    /**
     * A container always names its verified image.
     *
     * @param  list<string>  $networkCapabilities
     *
     * @throws ExecutionPolicyInvalid
     */
    public function __construct(
        public readonly ExecutionModeType $mode,
        public readonly string|null $imageReference,
        public readonly string $worktree,
        public readonly ExecutionBudgets $budgets,
        public readonly array $networkCapabilities,
        public readonly bool $isAttachable = false,
    ) {
        if ($mode === ExecutionModeType::RequiredContainer && $imageReference === null) {
            throw ExecutionPolicyInvalid::imageMissing();
        }
    }

    /**
     * Whether the session runs in a container of its own: where its driver and the lines it runs are.
     */
    public function isOwnContainer(): bool
    {
        return $this->mode === ExecutionModeType::RequiredContainer;
    }

    /**
     * The same policy for a start of a driver with or without a screen: a container is attachable only for a driver
     * that runs in a terminal of its own, whatever its profile allows; a driver without one runs a turn at a time.
     */
    public function forDriverScreen(bool $hasScreen): self
    {
        return clone ($this, ['isAttachable' => $this->isAttachable && $hasScreen]);
    }
}
