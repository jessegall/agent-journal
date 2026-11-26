<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Tests\Architecture\Support\ToolCheck;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * No public model method is called only by tests: such a method is a second copy of behaviour the application no
 * longer uses. tools/refactoring/test-only-methods.php finds them; the ones already known wait in
 * docs/naming/test-only-model-methods.txt for their own decision, so only a new one fails.
 */
#[TimeLimit(seconds: 60, reason: 'It parses every model and reads the whole application and its tests.')]
final class TestOnlyModelMethodsTest extends TestCase
{
    private const string HOW_TO_FIX = 'Only tests call these model methods: ';

    public function test_no_new_model_method_is_called_only_by_tests(): void
    {
        $check = ToolCheck::run([PHP_BINARY, 'tools/refactoring/test-only-methods.php']);

        $this->assertSame('', trim($check->output()), self::HOW_TO_FIX.$check->output());
    }
}
