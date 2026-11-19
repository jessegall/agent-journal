<?php

declare(strict_types=1);

namespace Tests\Unit\Processes;

use App\Processes\Enums\AnalysisLimit;
use App\Processes\Enums\ParseOutcome;
use App\Processes\Enums\RedirectType;
use App\Processes\Enums\ShellDialect;
use App\Processes\Enums\TokenType;
use App\Processes\Enums\WordSegmentType;
use App\Processes\Syntax\LexedLine;
use App\Processes\Syntax\ShellLexer;
use App\Processes\Syntax\Token;
use PHPUnit\Framework\TestCase;

/**
 * The shell lexer keeps quoting, comments and here-documents as doc 21 section 5 asks, and never runs anything.
 */
final class ShellLexerTest extends TestCase
{
    public function test_a_quoted_separator_stays_inside_one_word(): void
    {
        $line = $this->lex('echo "a > b; c" \'d && e\'');

        $this->assertSame([TokenType::Word, TokenType::Word, TokenType::Word], $this->types($line));
        $this->assertSame('a > b; c', $line->tokens[1]->word?->literal());
        $this->assertSame('d && e', $line->tokens[2]->word?->literal());
    }

    public function test_operators_and_redirects_are_tokens_of_their_own(): void
    {
        $line = $this->lex('git log | grep fix && wc -l > out.log 2>&1; true');

        $this->assertSame(
            [
                TokenType::Word,
                TokenType::Word,
                TokenType::Pipe,
                TokenType::Word,
                TokenType::Word,
                TokenType::AndIf,
                TokenType::Word,
                TokenType::Word,
                TokenType::Redirect,
                TokenType::Word,
                TokenType::Redirect,
                TokenType::Word,
                TokenType::Semicolon,
                TokenType::Word,
            ],
            $this->types($line),
        );
        $this->assertSame(RedirectType::Output, $line->tokens[8]->redirect);
        $this->assertSame(2, $line->tokens[10]->descriptor);
        $this->assertSame(RedirectType::DuplicateOutput, $line->tokens[10]->redirect);
    }

    public function test_an_escaped_dollar_is_literal_and_an_unquoted_one_expands(): void
    {
        $line = $this->lex('echo \$HOME $HOME');

        $this->assertSame('$HOME', $line->tokens[1]->word?->literal());
        $this->assertNull($line->tokens[2]->word?->literal());
    }

    public function test_single_quotes_hold_no_substitution(): void
    {
        $line = $this->lex("echo '\$(rm a)'");

        $this->assertSame(
            [WordSegmentType::SingleQuoted],
            array_map(fn ($segment) => $segment->type, $line->tokens[1]->word->segments ?? []),
        );
    }

    public function test_an_empty_quoted_argument_survives(): void
    {
        $line = $this->lex('echo "" \'\'');

        $this->assertSame('', $line->tokens[1]->word?->literal());
        $this->assertSame('', $line->tokens[2]->word?->literal());
    }

    public function test_a_comment_starts_only_where_a_word_could(): void
    {
        $line = $this->lex('echo a#b # note');

        $this->assertSame([TokenType::Word, TokenType::Word, TokenType::Comment], $this->types($line));
        $this->assertSame('a#b', $line->tokens[1]->word?->literal());
    }

    public function test_a_quoted_here_document_exposes_no_substitution(): void
    {
        $line = $this->lex("cat <<'EOF'\n\$(rm a)\nEOF");
        $body = $this->bodyOf($line);

        $this->assertTrue($body->hereDocument?->isQuoted);
        $this->assertNull($body->word);
        $this->assertSame("\$(rm a)\n", $body->range->slice("cat <<'EOF'\n\$(rm a)\nEOF"));
    }

    public function test_an_unquoted_here_document_exposes_its_substitution(): void
    {
        $line = $this->lex("cat <<EOF\nhello \$(rm a)\nEOF");
        $body = $this->bodyOf($line);

        $this->assertFalse($body->hereDocument?->isQuoted);
        $this->assertSame(['rm a'], array_map(fn ($segment) => $segment->text, $body->word->segments ?? []));
    }

    public function test_a_tab_stripping_here_document_ends_at_an_indented_delimiter(): void
    {
        $line = $this->lex("cat <<-EOF\n\thello\n\tEOF\necho after");

        $this->assertTrue($this->bodyOf($line)->hereDocument?->stripsTabs);
        $this->assertSame(ParseOutcome::Complete, $line->outcome);
    }

    public function test_an_unfinished_quote_is_invalid_with_its_position(): void
    {
        $line = $this->lex('echo "unclosed');

        $this->assertSame(ParseOutcome::Invalid, $line->outcome);
        $this->assertSame(5, $line->diagnostic?->position);
    }

    public function test_an_unfinished_here_document_is_invalid(): void
    {
        $this->assertSame(ParseOutcome::Invalid, $this->lex("cat <<EOF\nhello")->outcome);
    }

    public function test_process_substitution_belongs_to_bash_and_zsh_only(): void
    {
        $bash = $this->lex('diff <(git show HEAD:a) b');
        $sh = new ShellLexer()->lex('diff <(git show HEAD:a) b', ShellDialect::Sh);

        $this->assertSame(WordSegmentType::Expansion, $bash->tokens[1]->word->segments[0]->type ?? null);
        $this->assertSame(TokenType::Redirect, $sh->tokens[1]->type);
    }

    public function test_a_line_past_the_size_limit_is_refused_whole(): void
    {
        $line = $this->lex(str_repeat('a', AnalysisLimit::SourceBytes->value + 1));

        $this->assertSame(ParseOutcome::LimitExceeded, $line->outcome);
        $this->assertSame([], $line->tokens);
    }

    private function lex(string $source): LexedLine
    {
        return new ShellLexer()->lex($source, ShellDialect::Bash);
    }

    /**
     * @return list<TokenType>
     */
    private function types(LexedLine $line): array
    {
        return array_map(fn (Token $token) => $token->type, $line->tokens);
    }

    private function bodyOf(LexedLine $line): Token
    {
        foreach ($line->tokens as $token) {
            if ($token->type === TokenType::HereDocumentBody) {
                return $token;
            }
        }
        $this->fail('The line has no here-document body.');
    }
}
