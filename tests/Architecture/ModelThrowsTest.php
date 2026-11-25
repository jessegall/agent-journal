<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Symfony\Component\Process\Process;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * A model throws only inside a method named assert<What>, which its other methods call (user messages 21923 and
 * 21928). tools/refactoring/model-throws.php lists every throw in a model method of another name.
 */
#[TimeLimit(seconds: 60, reason: 'It parses every PHP file of app and domain.')]
final class ModelThrowsTest extends TestCase
{
    private const string HOW_TO_FIX = 'Move each throw into an assert method under Asserts: ';

    private const string FIXTURE = 'tests/Fixtures/ModelThrows/ThrowsOutsideAnAssert.php';

    public function test_every_model_throws_only_from_an_assert_method(): void
    {
        $output = $this->checkOutput('app', 'domain');

        $this->assertSame('', trim($output), self::HOW_TO_FIX.$output);
    }

    public function test_a_throw_outside_an_assert_method_is_listed(): void
    {
        $this->assertStringContainsString(self::FIXTURE.':20', $this->checkOutput(self::FIXTURE));
    }

    private function checkOutput(string ...$paths): string
    {
        $check = new Process([PHP_BINARY, 'tools/refactoring/model-throws.php', ...$paths], base_path());
        $check->run();

        return $check->getOutput();
    }
}
