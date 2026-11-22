<?php

declare(strict_types=1);

namespace App\Support\Stored;

use App\Enums\ExecutionModeType;
use App\Values\ExecutionPolicy;
use Spatie\LaravelData\Data;

/**
 * An execution policy as the JSON column holds it.
 */
final class StoredExecutionPolicy extends Data
{
    /**
     * @param  list<string>  $network
     */
    public function __construct(
        public readonly ExecutionModeType $mode,
        public readonly string|null $image,
        public readonly string $worktree,
        public readonly StoredExecutionBudgets $budgets,
        public readonly array $network,
        public readonly bool $attachable = false,
    ) {}

    public static function fromExecutionPolicy(ExecutionPolicy $execution): self
    {
        return self::from([
            'mode' => $execution->mode,
            'image' => $execution->imageReference,
            'worktree' => $execution->worktree,
            'budgets' => StoredExecutionBudgets::fromExecutionBudgets($execution->budgets),
            'network' => $execution->networkCapabilities,
            'attachable' => $execution->attachable,
        ]);
    }

    public function toExecutionPolicy(): ExecutionPolicy
    {
        return ExecutionPolicy::make(
            $this->mode,
            $this->image,
            $this->worktree,
            $this->budgets->toExecutionBudgets(),
            $this->network,
            $this->attachable,
        );
    }
}
