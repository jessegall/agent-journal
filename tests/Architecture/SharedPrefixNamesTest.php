<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Tests\Architecture\Support\ToolCheck;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * A parameter drops a leading word its context already says ($profileKey and $profileRevision in a method
 * where nothing else is $key or $revision are $key and $revision). tools/refactoring/shared-prefix-names.php lists
 * every such name, and renames them with --fix.
 */
#[TimeLimit(seconds: 60, reason: 'It parses every PHP file of app and domain.')]
final class SharedPrefixNamesTest extends TestCase
{
    private const string HOW_TO_FIX = 'Rename these with --fix: ';

    public function test_no_parameter_keeps_a_leading_word_its_context_already_says(): void
    {
        $check = ToolCheck::run([PHP_BINARY, '-d', 'memory_limit=2G', 'tools/refactoring/shared-prefix-names.php', 'app', 'domain']);

        $this->assertSame('', trim($check->output()), self::HOW_TO_FIX.$check->output());
    }
}
