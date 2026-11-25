<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Symfony\Component\Process\Process;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * An Eloquent model's methods sit in marked sections, Constructors, Mutations, Getters, Accessors, Relations,
 * Asserts, Internals, Queries and Scopes, in that order (user messages 22032, 22039 and 22042), and an accessor (a
 * method returning Attribute) sits only in Accessors. tools/refactoring/model-sections.php lists every fault, and
 * sorts with --fix.
 */
#[TimeLimit(seconds: 60, reason: 'It parses every PHP file of app and domain.')]
final class ModelSectionsTest extends TestCase
{
    private const string HOW_TO_FIX = 'Sort them with php tools/refactoring/model-sections.php --fix app domain: ';

    private const string MISPLACED_ACCESSOR = 'accessor progress sits in Getters, not in Accessors';

    private const string PLAIN_METHOD_IN_ACCESSORS = 'method isDone is no accessor, so it does not belong in Accessors';

    private const string MISPLACED_ASSERT = 'assert method assertOpen sits in Internals, not in Asserts';

    private const string PLAIN_METHOD_IN_ASSERTS = 'method isOpen is no assert method, so it does not belong in Asserts';

    public function test_every_model_method_sits_in_a_known_section_in_order(): void
    {
        $check = new Process(
            [PHP_BINARY, 'tools/refactoring/model-sections.php', 'app', 'domain'],
            base_path(),
        );
        $check->run();

        $this->assertSame('', trim($check->getOutput()), self::HOW_TO_FIX.$check->getOutput());
    }

    public function test_an_accessor_outside_accessors_and_a_plain_method_inside_it_are_flagged(): void
    {
        $output = $this->checkOutput('tests/Fixtures/ModelSections/AccessorOutsideAccessors.php');

        $this->assertStringContainsString(self::MISPLACED_ACCESSOR, $output);
        $this->assertStringContainsString(self::PLAIN_METHOD_IN_ACCESSORS, $output);
    }

    public function test_an_assert_outside_asserts_and_a_plain_method_inside_it_are_flagged(): void
    {
        $output = $this->checkOutput('tests/Fixtures/ModelSections/AssertOutsideAsserts.php');

        $this->assertStringContainsString(self::MISPLACED_ASSERT, $output);
        $this->assertStringContainsString(self::PLAIN_METHOD_IN_ASSERTS, $output);
    }

    public function test_an_accessor_in_accessors_is_clean(): void
    {
        $this->assertSame('', trim($this->checkOutput('tests/Fixtures/ModelSections/AccessorInAccessors.php')));
    }

    private function checkOutput(string $path): string
    {
        $check = new Process([PHP_BINARY, 'tools/refactoring/model-sections.php', $path], base_path());
        $check->run();

        return $check->getOutput();
    }
}
