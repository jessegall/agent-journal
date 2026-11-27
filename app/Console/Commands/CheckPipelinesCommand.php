<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Pipelines\Support\PipelineValidator;
use Illuminate\Console\Command;

final class CheckPipelinesCommand extends Command
{
    protected $signature = 'journal:pipelines';

    protected $description = 'Check that every pipeline\'s steps chain from its input to its output, without running them';

    public function handle(PipelineValidator $validator): int
    {
        $pipelines = $validator->pipelines();
        $faults = $validator->faultsOf($pipelines);

        foreach ($faults as $fault) {
            $this->error($fault);
        }

        if ($faults !== []) {
            return self::FAILURE;
        }

        $this->line(count($pipelines).' pipelines chain from their input to their output.');

        return self::SUCCESS;
    }
}
