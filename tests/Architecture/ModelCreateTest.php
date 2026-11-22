<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Symfony\Component\Process\Process;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Rule 40: a model makes its new rows through one static create, which shadows Eloquent's Model::create([...]), so
 * code can make a row only with the model's own typed arguments (user message 10984).
 * tools/refactoring/model-constructors.php lists each row-making static method named otherwise.
 */
#[TimeLimit(seconds: 60, reason: 'It parses every PHP file of app and domain.')]
final class ModelCreateTest extends TestCase
{
    private const string HOW_TO_FIX = 'Name these create: ';

    public function test_every_model_makes_its_new_rows_through_create(): void
    {
        $check = new Process([PHP_BINARY, 'tools/refactoring/model-constructors.php', 'app', 'domain'], base_path());
        $check->run();

        $this->assertSame('', trim($check->getOutput()), self::HOW_TO_FIX.$check->getOutput());
    }
}
