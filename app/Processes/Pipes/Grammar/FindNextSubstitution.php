<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Grammar;

use App\Pipelines\Contracts\Pipe;
use App\Processes\Enums\NodeType;
use App\Processes\Enums\ParseOutcome;
use App\Processes\Enums\WordSegmentType;
use App\Processes\Exceptions\ShellGrammarStopped;
use App\Processes\Syntax\ShellLexer;
use App\Processes\Values\Grammar\PendingSegment;
use App\Processes\Values\Grammar\SubstitutionQueue;
use App\Processes\Values\Lines\ShellSource;
use App\Processes\Values\WordSegment;

/**
 * Searches the queued segments in order for the next command or process substitution, and opens its node. The inside
 * of ${...}, $((...)) and [[ ]] is searched before the segments after it; arithmetic comparison and shift signs are
 * blanked first, since they are no redirects.
 */
final readonly class FindNextSubstitution implements Pipe
{
    public function __construct(private ShellLexer $lexer) {}

    /**
     * @throws ShellGrammarStopped
     */
    public function handle(SubstitutionQueue $queue): SubstitutionQueue
    {
        $pending = $queue->pending;
        while ($pending !== []) {
            $next = array_shift($pending);
            $inside = $this->insideOf($next);
            if ($inside !== null) {
                $pending = [...$inside, ...$pending];

                continue;
            }
            $substitution = $this->substitutionOf($next);
            if ($substitution !== null) {
                return $queue->found($substitution, $pending);
            }
        }

        return $queue->emptied();
    }

    /**
     * The segments of the words inside a [[ ]] test, ${...} or $((...)), one level deeper; null for any other segment.
     *
     * @return list<PendingSegment>|null
     *
     * @throws ShellGrammarStopped
     */
    private function insideOf(PendingSegment $next): array|null
    {
        $segment = $next->segment;
        $start = $segment->range->start;
        if ($this->isTest($segment)) {
            return $this->wordsInside($next, substr($segment->text, 3, -2), $start + 3);
        }
        if ($segment->type !== WordSegmentType::Expansion) {
            return null;
        }
        $line = $next->reading->draft()->line;
        if (substr($line, $start, 2) === '${') {
            return $this->wordsInside($next, substr($segment->text, 2, -1), $start + 2);
        }
        if (substr($line, $start, 3) === '$((') {
            return $this->wordsInside($next, strtr($segment->text, '<>', '  '), $start + 2);
        }

        return null;
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
     * @return list<PendingSegment>
     *
     * @throws ShellGrammarStopped
     */
    private function wordsInside(PendingSegment $next, string $text, int $offset): array
    {
        $lexed = $this->lexer->lex($text, $next->reading->draft()->dialect);
        if ($lexed->outcome !== ParseOutcome::Complete) {
            throw ShellGrammarStopped::fromLexedLine($lexed, $offset);
        }
        $inside = [];
        foreach ($lexed->tokens as $token) {
            if ($token->word === null) {
                continue;
            }
            $word = $next->reading->inside($token->word->shiftedBy($offset));
            $inside = [...$inside, ...PendingSegment::allOf($word)];
        }

        return $inside;
    }

    /**
     * The inside of a $(...), backtick or process substitution as a source of its own, under a new node; null for
     * any other segment.
     */
    private function substitutionOf(PendingSegment $next): ShellSource|null
    {
        $segment = $next->segment;
        if ($segment->type !== WordSegmentType::Expansion) {
            return null;
        }
        $draft = $next->reading->draft();
        $opening = substr($draft->line, $segment->range->start, 2);
        $isBacktick = str_starts_with($opening, '`');
        $type = match (true) {
            $opening === '$(', $isBacktick => NodeType::CommandSubstitution,
            $opening === '<(', $opening === '>(' => NodeType::ProcessSubstitution,
            default => null,
        };
        if ($type === null) {
            return null;
        }
        if ($isBacktick && str_contains($segment->text, '\\`')) {
            $reason = 'A backtick substitution nested inside another is not supported.';
            $draft->markUnsupported($reason, $segment->range->start);
        }
        $substitution = $draft->add($type, $segment->range, $next->reading->owner);
        $innerStart = $segment->range->start + ($isBacktick ? 1 : 2);

        return $next->reading->innerSource($segment->text, $innerStart, $substitution);
    }
}
