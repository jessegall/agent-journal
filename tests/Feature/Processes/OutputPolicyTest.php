<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Processes\Admission\OutputPolicy;
use App\Processes\Contracts\CommandClassifier;
use App\Processes\Contracts\ShellSyntax;
use App\Processes\Enums\ShellDialect;
use App\Processes\Values\ExecutionContext;
use App\Processes\Values\OutputVerdict;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A check or build whose output would be hidden starts nothing, and the refusal names what is lost and the command to
 * run instead (doc 21 revision 6, section 54; stories 119-123, 167, 168 and 203).
 */
final class OutputPolicyTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_piped_build_is_refused_with_its_correction(): void
    {
        $verdict = $this->verdict('php artisan wayfinder:generate | tail -20');

        $this->assertFalse($verdict->isAllowed());
        $this->assertSame('php artisan wayfinder:generate', $verdict->hidden[0]->correction);
        $this->assertStringContainsString('the pipe', $verdict->reasons()[0]);
    }

    public function test_a_piped_check_loses_its_status_and_pipefail_waives_nothing(): void
    {
        $this->assertStringContainsString(
            'exit status',
            $this->verdict('vendor/bin/phpstan analyse | grep error')->reasons()[0],
        );
        $this->assertFalse($this->verdict('set -o pipefail; vue-tsc --noEmit | cut -c1-80')->isAllowed());
    }

    public function test_redirects_around_a_check_are_refused_and_name_the_stream(): void
    {
        $this->assertSame(
            'php artisan test',
            $this->verdict('{ php artisan test; } > result.log')->hidden[0]->correction,
        );
        $this->assertStringContainsString(
            'standard error',
            $this->verdict('php artisan test 2>/dev/null')->reasons()[0],
        );
    }

    public function test_an_ordinary_pipeline_passes(): void
    {
        $this->assertTrue($this->verdict('cat a | grep b')->isAllowed());
    }

    private function verdict(string $line): OutputVerdict
    {
        $tree = $this->app->make(ShellSyntax::class)->parse($line, ShellDialect::Bash);
        $classification = $this->app->make(CommandClassifier::class)->classify(
            $tree,
            new ExecutionContext(ShellDialect::Bash, base_path(), base_path()),
        );

        return $this->app->make(OutputPolicy::class)->check($classification);
    }
}
