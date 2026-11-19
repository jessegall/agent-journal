<?php

declare(strict_types=1);

namespace App\AgentRequests\Console\Concerns;

use App\AgentRequests\Exceptions\CommandStopped;
use App\AgentRequests\Values\CommandReport;
use App\Pipelines\Contracts\PipelineDefinition;
use App\Pipelines\Support\Pipelines;
use Illuminate\Container\Container;

/**
 * The console boundary of signed calls: a command runs its pipeline to a report and prints it; a failure prints its
 * own lines and, for a keyed write, how to get its answer again without making it twice.
 */
trait RunsCallPipelines
{
    /**
     * @param  class-string<PipelineDefinition>  $pipeline
     */
    protected function runCalls(string $pipeline, object $input): int
    {
        try {
            $report = Container::getInstance()->make(Pipelines::class)->run($pipeline, $input, CommandReport::class);
        } catch (CommandStopped $stopped) {
            foreach ($stopped->consoleLines() as $line) {
                $this->error($line);
            }

            $key = $stopped->retryKey();

            if ($key !== null) {
                $this->line("Retry with --request-key={$key->value} to get this write's answer without making it twice.");
            }

            return self::FAILURE;
        }

        $report->printTo($this);

        return $report->status;
    }
}
