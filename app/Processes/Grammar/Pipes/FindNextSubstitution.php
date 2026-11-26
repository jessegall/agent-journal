<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Pipes;

use App\Bus\Contracts\Pipe;
use App\CommandRules\Enums\NodeType;
use App\CommandRules\Enums\ParseOutcome;
use App\CommandRules\Enums\WordSegmentType;
use App\Exceptions\ShellGrammarStopped;
use App\Processes\Grammar\Lines\ShellSource;
use App\Processes\Grammar\PendingSegment;
use App\Processes\Grammar\SubstitutionQueue;
use App\Processes\Grammar\Syntax\ShellLexer;
use App\Processes\Grammar\Values\WordSegment;
use App\Values\AgentText;

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

        return $queue->empty();
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

        $line = $next->toParse->draft()->line;

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
        $lexed = $this->lexer->lex($text, $next->toParse->draft()->dialect);

        if ($lexed->outcome !== ParseOutcome::Complete) {
            throw ShellGrammarStopped::fromLexedLine($lexed, $offset);
        }

        $inside = [];

        foreach ($lexed->tokens as $token) {
            if ($token->word === null) {
                continue;
            }

            $word = $next->toParse->inside($token->word->shiftedBy($offset));
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

        $draft = $next->toParse->draft();
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
            $reason = AgentText::of('core.shell.nested_backtick');
            $draft->markUnsupported($reason, $segment->range->start);
        }

        $substitution = $draft->add($type, $segment->range, $next->toParse->owner);
        $innerStart = $segment->range->start + ($isBacktick ? 1 : 2);

        return $next->toParse->innerSource($segment->text, $innerStart, $substitution);
    }
}
