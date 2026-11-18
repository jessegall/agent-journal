<?php

declare(strict_types=1);

namespace App\Processes\Contracts;

use App\Processes\Values\ExecutionContext;
use App\Processes\Values\PartClassification;
use App\Processes\Values\ProgramIdentity;
use App\Processes\Values\ShellNode;

/**
 * The trusted extension seam for a program too complex for a declarative rule, such as an interpreter: it classifies
 * one part of that program itself, reporting what it cannot place as unresolved facts.
 */
interface ProgramClassifier
{
    public function classifies(ProgramIdentity $program): bool;

    public function classify(ShellNode $part, ProgramIdentity $program, ExecutionContext $context): PartClassification;
}
