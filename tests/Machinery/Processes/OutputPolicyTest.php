<?php

declare(strict_types=1);

namespace Tests\Machinery\Processes;

use App\Contracts\Bus\CommandClassifier;
use App\Enums\Processes\ShellDialect;
use App\Support\Admission\OutputPolicy;
use App\Support\Syntax\TreeParser;
use App\Values\ExecutionContext;
use App\Values\OutputVerdict;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A check or build whose output would be hidden starts nothing, and the refusal names what is lost and the command to
 * run instead.
 */
final class OutputPolicyTest extends TestCase
{
    use RefreshHookDatabase;

    private const string WAYFINDER_COMMAND = 'php artisan wayfinder:generate';

    private const string TEST_COMMAND = 'php artisan test';

    private const string THE_PIPE = 'the pipe';

    private const string EXIT_STATUS = 'exit status';

    private const string STANDARD_ERROR = 'standard error';

    public function test_a_piped_build_is_refused_with_its_correction(): void
    {
        $verdict = $this->verdict('php artisan wayfinder:generate | tail -20');

        $this->assertFalse($verdict->isAllowed());
        $this->assertSame(self::WAYFINDER_COMMAND, $verdict->hidden[0]->correction);
        $this->assertStringContainsString(self::THE_PIPE, $verdict->reasons()[0]);
    }

    public function test_a_piped_check_loses_its_status_and_pipefail_waives_nothing(): void
    {
        $this->assertStringContainsString(
            self::EXIT_STATUS,
            $this->verdict('vendor/bin/phpstan analyse | grep error')->reasons()[0],
        );
        $this->assertFalse($this->verdict('set -o pipefail; vue-tsc --noEmit | cut -c1-80')->isAllowed());
    }

    public function test_redirects_around_a_check_are_refused_and_name_the_stream(): void
    {
        $this->assertSame(
            self::TEST_COMMAND,
            $this->verdict('{ php artisan test; } > result.log')->hidden[0]->correction,
        );
        $this->assertStringContainsString(
            self::STANDARD_ERROR,
            $this->verdict('php artisan test 2>/dev/null')->reasons()[0],
        );
    }

    public function test_an_ordinary_pipeline_passes(): void
    {
        $this->assertTrue($this->verdict('cat a | grep b')->isAllowed());
    }

    private function verdict(string $line): OutputVerdict
    {
        $tree = $this->app->make(TreeParser::class)->parse($line, ShellDialect::Bash);
        $classification = $this->app->make(CommandClassifier::class)->classify(
            $tree,
            new ExecutionContext(ShellDialect::Bash, base_path(), base_path()),
        );

        return $this->app->make(OutputPolicy::class)->check($classification);
    }
}
