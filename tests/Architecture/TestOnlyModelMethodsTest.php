<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Symfony\Component\Process\Process;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * No public model method is called only by tests: such a method is a second copy of behaviour the application no
 * longer uses (user 10742). tools/refactoring/test-only-methods.php finds them; the ones already known wait in
 * docs/naming/test-only-model-methods.txt for their own decision, so only a new one fails.
 */
#[TimeLimit(seconds: 60, reason: 'It parses every model and reads the whole application and its tests.')]
final class TestOnlyModelMethodsTest extends TestCase
{
    public function test_no_new_model_method_is_called_only_by_tests(): void
    {
        $check = new Process([PHP_BINARY, 'tools/refactoring/test-only-methods.php'], base_path());
        $check->run();

        $this->assertSame('', trim($check->getOutput()), 'Only tests call these model methods: '.$check->getOutput());
    }
}
