<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Symfony\Component\Process\Process;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * An Eloquent model's methods sit in marked sections, Constructors, Mutations, Predicates, Transformers, Calculations,
 * Accessors, Relations, Asserts, Internals, Queries and Scopes, in that order (user messages 22032, 22042, 22044 and
 * 22120): a yes or no answer in Predicates, an object in Transformers, a scalar no accessor can give in Calculations,
 * and an accessor (returning Attribute) only in Accessors. A constructor is named create, or createFor and what it is
 * made from when the model has several, and a row builder only one constructor uses is inlined into it (user messages
 * 22052 and 22060). tools/refactoring/model-sections.php lists every fault, and sorts with --fix.
 */
#[TimeLimit(seconds: 60, reason: 'It parses every PHP file of app and domain.')]
final class ModelSectionsTest extends TestCase
{
    private const string HOW_TO_FIX = 'Sort them with php tools/refactoring/model-sections.php --fix app domain: ';

    private const string MISPLACED_ACCESSOR = 'accessor progress sits in Transformers, not in Accessors';

    private const string VALUE_IN_PREDICATES = 'method label answers no yes or no, so it does not belong in Predicates';

    private const string QUESTION_IN_TRANSFORMERS = 'method isOpen gives no object, so it does not belong in '
        .'Transformers';

    private const string OBJECT_IN_CALCULATIONS = 'method words gives no string, int or float, so it does not belong'
        .' in Calculations';

    private const string PLAIN_METHOD_IN_ACCESSORS = 'method isDone is no accessor, so it does not belong in Accessors';

    private const string MISPLACED_ASSERT = 'assert method assertOpen sits in Internals, not in Asserts';

    private const string PLAIN_METHOD_IN_ASSERTS = 'method isOpen is no assert method, so it does not belong in Asserts';

    private const string PLAIN_CREATE_BESIDE_ANOTHER = 'constructor create is one of 2, so it is named createFor';

    private const string CONSTRUCTOR_NAMED_OTHERWISE = 'constructor open is one of 2, so it is named createFor';

    private const string BATCH_WITHOUT_IDS = 'batch constructor create returns the ids of the rows it wrote, as an array';

    private const string BUILDER_OF_ONE_CONSTRUCTOR = 'builder draft serves only the constructor open: inline it';

    private const string NULLABLE_ASSERT = 'assert assertFound takes the nullable $row: an assert guards a precondition';

    private const string JUDGED_READ = 'method ofId reads $row and then judges it for absence';

    private const string LATE_ASSERT = 'method reopen calls an assert after its work: call each assert first';

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

    public function test_misplaced_predicates_transformers_and_calculations_are_flagged(): void
    {
        $output = $this->checkOutput('tests/Fixtures/ModelSections/AnswersInTheWrongSection.php');

        $this->assertStringContainsString(self::VALUE_IN_PREDICATES, $output);
        $this->assertStringContainsString(self::QUESTION_IN_TRANSFORMERS, $output);
        $this->assertStringContainsString(self::OBJECT_IN_CALCULATIONS, $output);
    }

    public function test_an_assert_outside_asserts_and_a_plain_method_inside_it_are_flagged(): void
    {
        $output = $this->checkOutput('tests/Fixtures/ModelSections/AssertOutsideAsserts.php');

        $this->assertStringContainsString(self::MISPLACED_ASSERT, $output);
        $this->assertStringContainsString(self::PLAIN_METHOD_IN_ASSERTS, $output);
    }

    public function test_constructors_named_otherwise_and_a_builder_one_constructor_uses_are_flagged(): void
    {
        $output = $this->checkOutput('tests/Fixtures/ModelSections/ConstructorsNamedOtherwise.php');

        $this->assertStringContainsString(self::PLAIN_CREATE_BESIDE_ANOTHER, $output);
        $this->assertStringContainsString(self::CONSTRUCTOR_NAMED_OTHERWISE, $output);
        $this->assertStringContainsString(self::BUILDER_OF_ONE_CONSTRUCTOR, $output);
    }

    public function test_a_batch_constructor_that_gives_no_ids_is_flagged(): void
    {
        $output = $this->checkOutput('tests/Fixtures/ModelSections/BatchNamedCreate.php');

        $this->assertStringContainsString(self::BATCH_WITHOUT_IDS, $output);
    }

    public function test_an_assert_judging_a_read_and_an_assert_after_the_work_are_flagged(): void
    {
        $output = $this->checkOutput('tests/Fixtures/ModelSections/AssertsThatJudgeReads.php');

        $this->assertStringContainsString(self::NULLABLE_ASSERT, $output);
        $this->assertStringContainsString(self::JUDGED_READ, $output);
        $this->assertStringContainsString(self::LATE_ASSERT, $output);
        $this->assertStringNotContainsString('method close calls an assert', $output);
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
