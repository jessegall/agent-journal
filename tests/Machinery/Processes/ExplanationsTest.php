<?php

declare(strict_types=1);

namespace Tests\Machinery\Processes;

use App\Data\Processes\ExplanationData;
use App\Enums\CommandRules\AnalysisLimit;
use App\Enums\Processes\ShellDialect;
use App\Support\Explanations;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * Explaining a line shows its tree from the bound syntax and never runs, opens or expands anything.
 */
final class ExplanationsTest extends TestCase
{
    use RefreshHookDatabase;

    private const string LINE = 'cat a > b';

    private const string REDIRECT = 'output 1 b';

    private const string SECRET_TEXT = 'secret text';

    public function test_a_command_with_an_output_redirect_shows_the_part_and_the_redirect(): void
    {
        $explanation = $this->explain(self::LINE);
        $command = collect($explanation->nodes)->firstWhere('type', 'simple_command');

        $this->assertSame(1, $explanation->executableParts);
        $this->assertSame(self::LINE, $command?->snippet);
        $this->assertSame([self::REDIRECT], $command->redirects ?? []);
    }

    public function test_a_blank_line_has_no_executable_parts(): void
    {
        $this->assertSame(0, $this->explain('   # a note')->executableParts);
    }

    public function test_an_unfinished_quote_is_invalid_with_its_position(): void
    {
        $explanation = $this->explain('echo "open');

        $this->assertSame('invalid', $explanation->outcome);
        $this->assertSame(5, $explanation->diagnosticPosition);
    }

    public function test_a_line_past_the_size_limit_names_the_limit(): void
    {
        $this->assertSame(
            'limit_exceeded',
            $this->explain(str_repeat('a', AnalysisLimit::SourceBytes->value + 1))->outcome,
        );
    }

    public function test_a_here_document_body_is_left_out(): void
    {
        $explanation = $this->explain(<<<'TEXT'
        cat <<EOF
        secret text
        EOF
        TEXT);

        $shown = json_encode($explanation->toArray(), JSON_THROW_ON_ERROR);

        $this->assertStringNotContainsString(self::SECRET_TEXT, $shown);
    }

    private function explain(string $line): ExplanationData
    {
        return $this->app->make(Explanations::class)->explain($line, ShellDialect::Bash);
    }
}
