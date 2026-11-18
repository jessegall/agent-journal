<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Grammar;

use App\Pipelines\Contracts\Pipe;
use App\Pipelines\Support\Pipelines;
use App\Processes\Enums\AnalysisLimit;
use App\Processes\Enums\TokenType;
use App\Processes\Exceptions\ShellGrammarStopped;
use App\Processes\Pipelines\ReadListPipeline;
use App\Processes\Pipelines\ReadRedirectPipeline;
use App\Processes\Values\Grammar\CompoundReading;
use App\Processes\Values\Grammar\ListRead;
use App\Processes\Values\Grammar\NodeRead;
use App\Processes\Values\Redirect;
use App\Processes\Values\SourceRange;

/**
 * ( list ) redirects | { list } redirects: the list inside runs through the list pipeline again, one level deeper.
 */
final readonly class ReadCompound implements Pipe
{
    public function __construct(private Pipelines $pipelines) {}

    /**
     * @throws ShellGrammarStopped
     */
    public function handle(CompoundReading $reading): NodeRead
    {
        $cursor = $reading->cursor();
        if (AnalysisLimit::Depth->isPassedBy($reading->depth + 1)) {
            throw ShellGrammarStopped::pastLimit(AnalysisLimit::Depth, $cursor->position());
        }
        $open = $cursor->current();
        $cursor->advance();
        $compound = $reading->draft()->add($reading->type, $open->range, null);
        $this->pipelines->run(ReadListPipeline::class, $reading->list($compound), ListRead::class);
        $start = $open->range->start + $cursor->offset();
        if (! $cursor->is($reading->closing)) {
            throw ShellGrammarStopped::invalid("The {$reading->name()} opened here is not closed.", $start);
        }
        $end = $cursor->currentEnd();
        $cursor->advance();
        $redirects = [];
        while ($cursor->is(TokenType::Redirect)) {
            $redirect = $this->readRedirect($reading, $compound);
            $redirects[] = $redirect;
            $end = $redirect->range->end;
        }
        $reading->draft()->finish($compound, new SourceRange($start, $end), [], $redirects);

        return new NodeRead($compound);
    }

    /**
     * @throws ShellGrammarStopped
     */
    private function readRedirect(CompoundReading $reading, int $compound): Redirect
    {
        return $this->pipelines->run(ReadRedirectPipeline::class, $reading->redirect($compound), Redirect::class);
    }
}
