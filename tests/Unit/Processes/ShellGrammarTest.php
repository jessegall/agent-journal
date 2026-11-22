<?php

declare(strict_types=1);

namespace Tests\Unit\Processes;

use App\Enums\AnalysisLimit;
use App\Enums\NodeType;
use App\Enums\ParseOutcome;
use App\Values\ShellNode;
use App\Values\ShellTree;
use PHPUnit\Framework\TestCase;
use Tests\Support\Processes\ParsesBashLines;

/**
 * The shell grammar builds the lossless tree of doc 21 section 5 and stops at its limits with a diagnostic only.
 */
final class ShellGrammarTest extends TestCase
{
    use ParsesBashLines;

    public function test_a_pipe_puts_two_commands_under_one_pipeline(): void
    {
        $tree = $this->parse('cat a | head -5');
        $parts = $tree->executableParts();

        $this->assertSame(ParseOutcome::Complete, $tree->outcome);
        $this->assertSame(['cat a', 'head -5'], $this->texts($tree, $parts));
        $this->assertSame(NodeType::Pipeline, $tree->node($parts[0]->parent)->type);
        $this->assertSame($parts[0]->parent, $parts[1]->parent);
    }

    public function test_a_command_after_and_stays_visible(): void
    {
        $tree = $this->parse('false && rm a');

        $this->assertSame(['false', 'rm a'], $this->texts($tree, $tree->executableParts()));
        $this->assertSame(NodeType::AndList, $tree->node($tree->executableParts()[1]->parent)->type);
    }

    public function test_a_quoted_semicolon_stays_one_part(): void
    {
        $this->assertCount(1, $this->parse('echo "a; b"')->executableParts());
    }

    public function test_a_subshell_keeps_its_children_and_a_group_redirect_covers_the_group(): void
    {
        $subshell = $this->parse('(cd src && make)');
        $group = $this->parse('{ git status; git diff; } > out.log');

        $this->assertSame(['cd src', 'make'], $this->texts($subshell, $subshell->executableParts()));
        $this->assertCount(1, $this->firstOfType($group, NodeType::Group)->redirects);
        $this->assertCount(2, $group->executableParts());
        $this->assertSame([], $group->executableParts()[0]->redirects);
    }

    public function test_a_substitution_is_read_into_children_of_its_command(): void
    {
        $tree = $this->parse('echo $(git rev-parse HEAD)');
        $parts = $tree->executableParts();

        $this->assertSame(['echo $(git rev-parse HEAD)', 'git rev-parse HEAD'], $this->texts($tree, $parts));
        $this->assertSame(NodeType::CommandSubstitution, $tree->node($tree->node($parts[1]->parent)->parent)->type);
    }

    public function test_an_unquoted_here_document_exposes_its_substitution(): void
    {
        $tree = $this->parse(<<<'TEXT'
        cat <<EOF
        hi $(rm a)
        EOF
        TEXT);

        $this->assertSame(['rm a'], array_slice($this->texts($tree, $tree->executableParts()), 1));
    }

    public function test_a_background_job_is_its_own_node(): void
    {
        $tree = $this->parse('sleep 5 & echo done');

        $this->assertSame(NodeType::Background, $tree->node($tree->executableParts()[0]->parent)->type);
    }

    public function test_a_redirect_only_command_has_no_words(): void
    {
        $parts = $this->parse('> out.log')->executableParts();

        $this->assertCount(1, $parts);
        $this->assertSame([], $parts[0]->words);
        $this->assertCount(1, $parts[0]->redirects);
    }

    public function test_an_empty_or_comment_line_is_complete_with_no_part(): void
    {
        foreach (['', '   ', '# only a note'] as $line) {
            $tree = $this->parse($line);
            $this->assertSame(ParseOutcome::Complete, $tree->outcome, $line);
            $this->assertSame([], $tree->executableParts(), $line);
        }
    }

    public function test_unfinished_syntax_is_invalid_with_its_position(): void
    {
        $this->assertSame(ParseOutcome::Invalid, $this->parse('echo "open')->outcome);
        $this->assertSame(ParseOutcome::Invalid, $this->parse("cat <<EOF\nno end")->outcome);
        $this->assertSame(ParseOutcome::Invalid, $this->parse('(git status')->outcome);
        $this->assertSame(ParseOutcome::Invalid, $this->parse('git status |')->outcome);
        $this->assertSame(5, $this->parse('echo "open')->diagnostic?->position);
    }

    public function test_loops_and_conditionals_are_unsupported_whole_constructs(): void
    {
        $tree = $this->parse('for f in a b; do rm "$f"; done; echo after');

        $this->assertSame(ParseOutcome::Unsupported, $tree->outcome);
        $this->assertSame(NodeType::Unsupported, $tree->children($tree->root)[0]->type);
        $this->assertSame(['echo after'], $this->texts($tree, $tree->executableParts()));
    }

    public function test_the_limits_keep_only_a_diagnostic(): void
    {
        $tooLong = $this->parse(str_repeat('a', AnalysisLimit::SourceBytes->value + 1));
        $tooMany = $this->parse(implode(';', array_fill(0, AnalysisLimit::ExecutableParts->value + 1, 'true')));
        $tooDeep = $this->parse(
            str_repeat('( ', AnalysisLimit::Depth->value + 1).'true'.str_repeat(' )', AnalysisLimit::Depth->value + 1),
        );

        foreach ([$tooLong, $tooMany, $tooDeep] as $tree) {
            $this->assertSame(ParseOutcome::LimitExceeded, $tree->outcome);
            $this->assertSame([], $tree->executableParts());
        }

        $this->assertNotNull($tooMany->diagnostic);
        $this->assertNotNull($tooDeep->diagnostic);
        $this->assertStringContainsString('1024', $tooMany->diagnostic->reason);
        $this->assertStringContainsString('depth', $tooDeep->diagnostic->reason);
    }

    /**
     * @param  list<ShellNode>  $nodes
     * @return list<string>
     */
    private function texts(ShellTree $tree, array $nodes): array
    {
        return array_map(fn (ShellNode $node) => $node->range->slice($tree->source), $nodes);
    }

    private function firstOfType(ShellTree $tree, NodeType $type): ShellNode
    {
        foreach ($tree->nodes as $node) {
            if ($node->type === $type) {
                return $node;
            }
        }

        $this->fail("The tree has no {$type->value} node.");
    }
}
