<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\CommandRules\Outcome;
use App\Exceptions\VerificationContractInvalid;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * The exit statuses a check is known to end with, each with its meaning and evidence. Any status outside the list is
 * an execution error; nothing assumes that a nonzero status means findings. A check whose exits are not yet proven
 * lists none, so every status is an execution error until a proof adds them.
 */
#[MapName(SnakeCaseMapper::class)]
final class ExitPolicy extends Data
{
    /**
     * @param  list<ExitBranch>  $branches
     */
    public function __construct(public readonly array $branches) {}

    /**
     * @throws VerificationContractInvalid
     */
    public static function of(ExitBranch ...$branches): self
    {
        $statuses = array_map(fn (ExitBranch $branch) => $branch->status, $branches);

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
            fn (ExitBranch $branch) => $branch->status === $status,
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
            fn (ExitBranch $branch) => ! in_array($branch->status, $statuses, true),
        ));
    }
}
