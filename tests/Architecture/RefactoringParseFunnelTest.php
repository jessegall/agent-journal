<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Symfony\Component\Process\Process;

/**
 * Every PHP parse of the refactoring tools goes through parsedOnce in tools/refactoring/php-parse.php, which stops a
 * run that would parse a file a second time, so no tool can parse the project again for each item it handles.
 */
final class RefactoringParseFunnelTest extends TestCase
{
    private const string FUNNEL = 'tools/refactoring/php-parse.php';

    private const string HOW_TO_FIX = 'Parse through parsedOnce() of '.self::FUNNEL.' instead: ';

    public function test_no_refactoring_tool_parses_php_outside_the_funnel(): void
    {
        $search = new Process(['git', 'grep', '-n', '-e', '->parse(', '--', 'tools/refactoring'], base_path());
        $search->run();

        $outside = array_values(array_filter(
            explode("\n", trim($search->getOutput())),
            fn (string $line) => $line !== '' && ! str_starts_with($line, self::FUNNEL.':'),
        ));

        $this->assertSame([], $outside, self::HOW_TO_FIX.implode(', ', $outside));
    }
}
