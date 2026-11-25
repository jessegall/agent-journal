<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Symfony\Component\Process\Process;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A model answer that takes nothing, changes nothing and answers more than yes or no is a Laravel accessor, and an
 * accessor writes, dispatches, runs and reads no rows. tools/refactoring/model-accessors.php lists every fault, and
 * rewrites the answers with --fix.
 */
#[TimeLimit(seconds: 60, reason: 'It parses every PHP file of app and domain.')]
final class ModelAccessorsTest extends TestCase
{
    private const string FIXTURE = 'tests/Fixtures/ModelAccessors/AnswersAndAccessors.php';

    private const string HOW_TO_FIX = 'Rewrite these with --fix: ';

    public function test_every_parameterless_model_answer_is_an_accessor_and_no_accessor_has_a_side_effect(): void
    {
        $output = $this->checkOutput('app', 'domain');

        $this->assertSame('', trim($output), self::HOW_TO_FIX.$output);
    }

    public function test_an_answer_that_belongs_in_an_accessor_and_accessors_that_write_or_give_objects_are_flagged(): void
    {
        preg_match_all('/\t(?:answer|accessor) (\w+)/', $this->checkOutput(self::FIXTURE), $flagged);

        $this->assertSame(['heading', 'savedTitle', 'words'], $flagged[1]);
    }

    private function checkOutput(string ...$paths): string
    {
        $check = new Process([PHP_BINARY, 'tools/refactoring/model-accessors.php', ...$paths], base_path());
        $check->run();

        return $check->getOutput();
    }
}
