<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Symfony\Component\Process\Process;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A statement that spans several lines is set apart by a blank line above and below, unless it is the first or last
 * of its block, while one-line statements in a row stay together (user message 13592). The syntax tree the code
 * rules read holds no blank lines, so tools/refactoring/blank-line-around-multiline-statement.php checks it from
 * PHP's own parse; run it without --check to add the lines.
 */
#[TimeLimit(seconds: 30, reason: 'It parses every PHP file of the application and its domains.')]
final class BlankLineAroundMultilineStatementTest extends TestCase
{
    private const string TOOL = 'tools/refactoring/blank-line-around-multiline-statement.php';

    public function test_every_statement_of_several_lines_in_app_and_domain_stands_apart(): void
    {
        $check = $this->check('app', 'domain');

        $this->assertTrue(
            $check->isSuccessful(),
            'These statements of several lines want a blank line around them: '.$check->getOutput(),
        );
    }

    public function test_an_array_between_two_one_line_assignments_is_found_and_a_first_one_is_not(): void
    {
        $sample = tempnam(sys_get_temp_dir(), 'blank-lines-').'.php';
        file_put_contents($sample, <<<'PHP'
            <?php

            function card(object $revision): array
            {
                $parts = [
                    $revision->title,
                ];
                $first = $revision->title;
                $second = $revision->number;
                $more = [
                    $first,
                    $second,
                ];
                $open = $more;

                return $open;
            }
            PHP);

        $check = $this->check($sample);

        $this->assertFalse($check->isSuccessful());
        $this->assertSame(
            ["{$sample}:7", "{$sample}:9", "{$sample}:13"],
            array_slice(explode("\n", trim($check->getOutput())), 0, -1),
        );
    }

    private function check(string ...$paths): Process
    {
        $check = new Process([PHP_BINARY, self::TOOL, '--check', ...$paths], base_path());
        $check->run();

        return $check;
    }
}
