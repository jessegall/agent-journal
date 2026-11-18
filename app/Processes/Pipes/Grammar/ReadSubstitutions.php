<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Grammar;

use App\Pipelines\Contracts\Pipe;
use App\Pipelines\Support\Pipelines;
use App\Processes\Enums\NodeType;
use App\Processes\Enums\ParseOutcome;
use App\Processes\Enums\WordSegmentType;
use App\Processes\Exceptions\ShellGrammarStopped;
use App\Processes\Pipelines\AnalyseLinePipeline;
use App\Processes\Stages\Grammar\SubstitutionsRead;
use App\Processes\Stages\Grammar\SubstitutionsReading;
use App\Processes\Stages\ReadSource;
use App\Processes\Syntax\ShellLexer;
use App\Processes\Values\WordSegment;

/**
 * Reads every command and process substitution of a word as a line of its own, through the analysis pipeline one
 * level deeper, into children of the owner node. The inside of ${...}, $((...)) and [[ ]] is searched for further
 * substitutions; arithmetic comparison and shift signs are blanked first, since they are no redirects.
 */
final readonly class ReadSubstitutions implements Pipe
{
    public function __construct(
        private Pipelines $pipelines,
        private ShellLexer $lexer,
    ) {}

    /**
     * @throws ShellGrammarStopped
     */
    public function handle(SubstitutionsReading $reading): SubstitutionsRead
    {
        foreach ($reading->word->segments as $segment) {
            $this->readSegment($reading, $segment);
        }

        return new SubstitutionsRead($reading->owner);
    }

    /**
     * @throws ShellGrammarStopped
     */
    private function readSegment(SubstitutionsReading $reading, WordSegment $segment): void
    {
        $start = $segment->range->start;
        if ($this->isTest($segment)) {
            $this->readInside($reading, substr($segment->text, 3, -2), $start + 3);

            return;
        }
        if ($segment->type !== WordSegmentType::Expansion) {
            return;
        }
        $line = $reading->draft()->line;
        $opening = substr($line, $start, 2);
        if ($opening === '${') {
            $this->readInside($reading, substr($segment->text, 2, -1), $start + 2);

            return;
        }
        if (substr($line, $start, 3) === '$((') {
            $this->readInside($reading, strtr($segment->text, '<>', '  '), $start + 2);

            return;
        }
        $this->readSubstitution($reading, $segment, $opening);
    }

    /**
     * Whether the segment is a [[ ]] test, whose inside is searched for substitutions.
     */
    private function isTest(WordSegment $segment): bool
    {
        return $segment->type === WordSegmentType::Literal
            && str_starts_with($segment->text, '[[ ')
            && str_ends_with($segment->text, ']]');
    }

    /**
     * @throws ShellGrammarStopped
     */
    private function readSubstitution(SubstitutionsReading $reading, WordSegment $segment, string $opening): void
    {
        $isBacktick = $opening[0] === '`';
        $type = match (true) {
            $opening === '$(', $isBacktick => NodeType::CommandSubstitution,
            $opening === '<(', $opening === '>(' => NodeType::ProcessSubstitution,
            default => null,
        };
        if ($type === null) {
            return;
        }
        $draft = $reading->draft();
        if ($isBacktick && str_contains($segment->text, '\\`')) {
            $reason = 'A backtick substitution nested inside another is not supported.';
            $draft->markUnsupported($reason, $segment->range->start);
        }
        $substitution = $draft->add($type, $segment->range, $reading->owner);
        $innerStart = $segment->range->start + ($isBacktick ? 1 : 2);
        $source = $reading->innerSource($segment->text, $innerStart, $substitution);
        $this->pipelines->run(AnalyseLinePipeline::class, $source, ReadSource::class);
    }

    /**
     * Reads the substitutions inside text that is not itself shell syntax, as children of the owner.
     *
     * @throws ShellGrammarStopped
     */
    private function readInside(SubstitutionsReading $reading, string $text, int $offset): void
    {
        $lexed = $this->lexer->lex($text, $reading->draft()->dialect);
        if ($lexed->outcome !== ParseOutcome::Complete) {
            throw ShellGrammarStopped::fromLexedLine($lexed, $offset);
        }
        foreach ($lexed->tokens as $token) {
            if ($token->word !== null) {
                $this->handle($reading->inside($token->word->shiftedBy($offset)));
            }
        }
    }
}
