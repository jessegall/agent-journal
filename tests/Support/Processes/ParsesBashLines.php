<?php

declare(strict_types=1);

namespace Tests\Support\Processes;

use App\Pipelines\Contracts\PipelineRunner as PipelineRunnerContract;
use App\Pipelines\Support\PipelineRunner;
use App\Processes\Enums\ShellDialect;
use App\Processes\Syntax\TreeParser;
use App\Processes\Values\ShellTree;
use Illuminate\Container\Container;
use Illuminate\Contracts\Container\Container as ContainerContract;

/**
 * Parses a bash line with a parser built in a bare container, for unit tests that boot no application.
 */
trait ParsesBashLines
{
    private function parse(string $line): ShellTree
    {
        $container = new Container();
        $container->bind(PipelineRunnerContract::class, PipelineRunner::class);
        $container->instance(ContainerContract::class, $container);

        return $container->make(TreeParser::class)->parse($line, ShellDialect::Bash);
    }
}
