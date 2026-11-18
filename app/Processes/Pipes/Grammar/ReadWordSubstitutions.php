<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Grammar;

use App\Pipelines\Contracts\Pipe;
use App\Pipelines\Support\Pipelines;
use App\Processes\Enums\WordPlace;
use App\Processes\Exceptions\ShellGrammarStopped;
use App\Processes\Pipelines\ReadSubstitutionsPipeline;
use App\Processes\Values\Grammar\SubstitutionsRead;
use App\Processes\Values\Grammar\WordReading;

/**
 * The substitutions of an argument or assignment are read as children of its command.
 */
final readonly class ReadWordSubstitutions implements Pipe
{
    public function __construct(private Pipelines $pipelines) {}

    /**
     * @throws ShellGrammarStopped
     */
    public function handle(WordReading $reading): WordReading
    {
        if ($reading->place !== WordPlace::ArrayAssignment) {
            $substitutions = $reading->substitutions();
            $this->pipelines->run(ReadSubstitutionsPipeline::class, $substitutions, SubstitutionsRead::class);
        }

        return $reading;
    }
}
