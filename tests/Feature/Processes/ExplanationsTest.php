<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Processes\Data\ExplanationData;
use App\Processes\Enums\AnalysisLimit;
use App\Processes\Enums\ShellDialect;
use App\Processes\Support\Explanations;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * Explaining a line shows its tree from the bound syntax and never runs, opens or expands anything.
 */
final class ExplanationsTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_command_with_an_output_redirect_shows_the_part_and_the_redirect(): void
    {
        $explanation = $this->explain('cat a > b');
        $command = collect($explanation->nodes)->firstWhere('type', 'simple_command');

        $this->assertSame(1, $explanation->executableParts);
        $this->assertSame('cat a > b', $command?->snippet);
        $this->assertSame(['output 1 b'], $command->redirects ?? []);
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
        $this->assertSame('limit_exceeded', $this->explain(str_repeat('a', AnalysisLimit::SourceBytes->value + 1))->outcome);
    }

    public function test_a_here_document_body_is_left_out(): void
    {
        $explanation = $this->explain("cat <<EOF\nsecret text\nEOF");

        $this->assertStringNotContainsString('secret text', json_encode($explanation->toArray(), JSON_THROW_ON_ERROR));
    }

    private function explain(string $line): ExplanationData
    {
        return $this->app->make(Explanations::class)->explain($line, ShellDialect::Bash);
    }
}
