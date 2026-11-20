<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Symfony\Component\Process\Process;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Rule 50: an Eloquent model's methods sit in marked sections, Constructors, Queries, Mutations, Answers, Relations,
 * Internals and Scopes, in that order. tools/refactoring/model-sections.php lists every fault, and sorts with --fix.
 */
#[TimeLimit(seconds: 60, reason: 'It parses every PHP file of app and domain.')]
final class ModelSectionsTest extends TestCase
{
    public function test_every_model_method_sits_in_a_known_section_in_order(): void
    {
        $check = new Process(
            [PHP_BINARY, 'tools/refactoring/model-sections.php', 'app', 'domain'],
            base_path(),
        );
        $check->run();

        $this->assertSame('', trim($check->getOutput()), 'Sort these with --fix: '.$check->getOutput());
    }
}
