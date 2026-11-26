<?php

declare(strict_types=1);

namespace App\Processes\Contracts;

use App\Processes\Values\ProgramIdentity;
use App\Values\ExecutionContext;
use App\Values\PartClassification;
use App\Values\Word;

/**
 * The trusted extension seam for a program too complex for a declarative rule, such as an interpreter: it classifies
 * one part of that program itself, reporting what it cannot place as unresolved facts.
 */
interface ProgramClassifier
{
    /**
     * Whether this classifier knows what the program does.
     */
    public function classifies(ProgramIdentity $program): bool;

    /**
     * @param  list<Word>  $words  the command's words, the program first
     */
    public function classify(
        array $words,
        int $node,
        ProgramIdentity $program,
        ExecutionContext $context,
    ): PartClassification;
}
