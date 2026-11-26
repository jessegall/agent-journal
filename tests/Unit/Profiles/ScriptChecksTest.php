<?php

declare(strict_types=1);

namespace Tests\Unit\Profiles;

use App\Contracts\Domains\DomainAvailability;
use App\Contracts\Scripts\ScriptChecks;
use App\Support\ScriptKeywordRegistration;
use App\Values\ScriptSource;
use App\Values\TextOperand;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Fixtures\Scripts\ExampleScriptKeyword;
use Tests\TestCase;

final class ScriptChecksTest extends TestCase
{
    public function test_a_stop_branch_uses_one_compiled_graph_with_named_ports(): void
    {
        $source = ScriptSource::fromDefinitions(<<<'SCRIPT'
ON STOP
IF workspace.dirty
  RUN tests
  YIELD "Check the results before committing."
END
END
SCRIPT, ['tests' => [
            'executable' => '/usr/local/bin/composer',
            'arguments' => ['test:affected'],
            'directory' => 'workspace',
            'effects' => ['read', 'test'],
            'timeout_seconds' => 600,
        ]]);

        $check = $this->app->make(ScriptChecks::class)->check($source);

        $this->assertSame([], $check->diagnostics);
        $this->assertNotNull($check->compiled);
        $compiled = $check->compiled;
        $this->assertSame('line-2', $compiled->handlers['STOP']->entry);
        $this->assertSame([
            'true' => 'line-3',
            'false' => 'final-checks',
            'failure' => 'return-policy',
        ], $compiled->instructions['line-2']->successors);
        $this->assertSame(['returned' => 'return-policy'], $compiled->instructions['line-4']->successors);
    }

    #[DataProvider('invalidScripts')]
    public function test_invalid_scripts_have_named_diagnostics_and_no_graph(
        string $source,
        string $code,
        int $line,
        int $column,
    ): void {
        $check = $this->app->make(ScriptChecks::class)->check(new ScriptSource($source));

        $this->assertNull($check->compiled);
        $diagnostic = $check->diagnostics[0];
        $this->assertSame([$code, $line, $column], [$diagnostic->code, $diagnostic->line, $diagnostic->column]);
        $this->assertGreaterThan(0, $diagnostic->length);
    }

    public static function invalidScripts(): array
    {
        return [
            ["\xFF", 'invalid_form', 1, 1],
            ['ON STOP'."\n".'  CHECK workspace.missing'."\n".'END', 'unknown_member', 2, 9],
            ['ON STOP'."\n".'IF workspace.dirty', 'unclosed_block', 2, 1],
            ['ON STOP'."\n".'RUN missing'."\n".'END', 'unknown_command', 2, 5],
        ];
    }

    public function test_an_external_text_statement_uses_the_same_parser(): void
    {
        $this->app->make(ScriptKeywordRegistration::class)->registerOwned('Review', ExampleScriptKeyword::definition());
        $this->mock(DomainAvailability::class)->shouldReceive('isEnabled')->with('Review')->andReturn(true);
        $this->app->make(DomainAvailability::class)->shouldReceive('isEnabled')->with('Core')->andReturn(true);
        $source = new ScriptSource("ON STOP\nNOTE \"Retain \\\"évidence\\\".\"\nEND");

        $check = $this->app->make(ScriptChecks::class)->check($source);

        $this->assertSame([], $check->diagnostics);
        $this->assertNotNull($check->compiled);
        $step = $check->compiled->instructions['line-2'];
        $this->assertSame('NOTE', $step->keyword);
        $this->assertEquals(new TextOperand('Retain "évidence".'), $step->operand);
    }
}
