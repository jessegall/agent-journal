<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Symfony\Component\Process\Process;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Rule 48: a parameter drops a leading word its context already says ($profileKey and $profileRevision in a method
 * where nothing else is $key or $revision are $key and $revision). tools/refactoring/shared-prefix-names.php lists
 * every such name, and renames them with --fix.
 */
#[TimeLimit(seconds: 60, reason: 'It parses every PHP file of app and domain.')]
final class SharedPrefixNamesTest extends TestCase
{
    public function test_no_parameter_keeps_a_leading_word_its_context_already_says(): void
    {
        $check = new Process(
            [PHP_BINARY, '-d', 'memory_limit=2G', 'tools/refactoring/shared-prefix-names.php', 'app', 'domain'],
            base_path(),
        );
        $check->run();

        $this->assertSame('', trim($check->getOutput()), 'Rename these with --fix: '.$check->getOutput());
    }
}
