<?php

declare(strict_types=1);

namespace App\CommandRules;

use App\Processes\Contracts\ProgramClassifier;
use App\Processes\Values\ProgramIdentity;

/**
 * The trusted program classifiers, each taking over the programs too complex for a declarative rule.
 */
final readonly class ProgramClassifiers
{
    /**
     * @param  list<ProgramClassifier>  $classifiers
     */
    public function __construct(private array $classifiers = []) {}

    /**
     * The classifier that takes this program, or none.
     *
     * @return list<ProgramClassifier>
     */
    public function for(ProgramIdentity $program): array
    {
        return array_values(
            array_filter(
                $this->classifiers,
                fn (ProgramClassifier $classifier) => $classifier->classifies($program),
            ),
        );
    }
}
