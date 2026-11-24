<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\Outcome;
use App\Exceptions\VerificationContractInvalid;

/**
 * The exit statuses a check is known to end with, each with its meaning and evidence. Any status outside the list is
 * an execution error; nothing assumes that a nonzero status means findings. A check whose exits are not yet proven
 * lists none, so every status is an execution error until a proof adds them.
 */
final readonly class ExitPolicy
{
    /**
     * @param  list<ExitBranch>  $branches
     */
    private function __construct(public array $branches) {}

    /**
     * @throws VerificationContractInvalid
     */
    public static function of(ExitBranch ...$branches): self
    {
        $statuses = array_map(fn (ExitBranch $branch): int => $branch->status, $branches);

        if (count($statuses) !== count(array_unique($statuses))) {
            throw VerificationContractInvalid::field('exits', 'each exit status is listed once');
        }

        return new self(array_values($branches));
    }

    public static function unproven(): self
    {
        return new self([]);
    }

    public function outcomeOf(int $status): Outcome
    {
        $branch = array_values(array_filter(
            $this->branches,
            fn (ExitBranch $branch): bool => $branch->status === $status,
        ));

        if ($branch === []) {
            return Outcome::ExecutionError;
        }

        return $branch[0]->outcome;
    }

    /**
     * The branches no given exit status covers.
     *
     * @param  list<int>  $statuses
     * @return list<ExitBranch>
     */
    public function branchesMissing(array $statuses): array
    {
        return array_values(array_filter(
            $this->branches,
            fn (ExitBranch $branch): bool => ! in_array($branch->status, $statuses, true),
        ));
    }
}
