<?php

declare(strict_types=1);

namespace Tests\Fixtures\Architecture\Names;

/**
 * A thing named for what will be done with it, holding a yes or no that is no question, a getter and a forbidden word.
 */
final class StepToRun
{
    public bool $retired = false;

    public function getStep(): string
    {
        return 'step';
    }

    public function underway(): string
    {
        return 'step';
    }
}
