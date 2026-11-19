<?php

declare(strict_types=1);

namespace Tests\Support\Processes;

use App\Processes\Contracts\CommandClassifier;
use App\Processes\Enums\ShellDialect;
use App\Processes\Syntax\TreeParser;
use App\Processes\Values\Classification;
use App\Processes\Values\ExecutionContext;

/**
 * Classifies a bash line as the runner would in the project folder.
 */
trait ClassifiesLines
{
    private function classify(string $line): Classification
    {
        $tree = $this->app->make(TreeParser::class)->parse($line, ShellDialect::Bash);

        return $this->app->make(CommandClassifier::class)->classify(
            $tree,
            new ExecutionContext(ShellDialect::Bash, base_path(), base_path()),
        );
    }
}
