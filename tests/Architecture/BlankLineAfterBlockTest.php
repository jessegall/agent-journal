<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Symfony\Component\Process\Process;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A blank line follows every closing brace that a statement follows (rule 52, user messages 11006 and 11012). The
 * code rules read the syntax tree, which holds no blank lines, so tools/refactoring/blank-line-after-block.php checks
 * it from PHP's own tokens; run it without --check to add the lines.
 */
#[TimeLimit(seconds: 15, reason: 'It reads every PHP file of the application and its tests.')]
final class BlankLineAfterBlockTest extends TestCase
{
    public function test_a_statement_after_a_closing_brace_has_a_blank_line_above_it(): void
    {
        $check = new Process(
            [PHP_BINARY, 'tools/refactoring/blank-line-after-block.php', '--check', 'app', 'domain', 'tests'],
            base_path(),
        );
        $check->run();

        $this->assertTrue(
            $check->isSuccessful(),
            'These closing braces want a blank line after them: '.$check->getOutput(),
        );
    }
}
