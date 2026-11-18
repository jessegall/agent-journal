<?php

declare(strict_types=1);

namespace Tests\Architecture;

use PHPUnit\Framework\TestCase;
use Tests\Support\RequirePhaseTests;
use Tests\Support\TimeLimits\TimeLimit;

#[TimeLimit(seconds: 15, reason: 'It parses the project files it judges.')]
final class PhaseTestGateTest extends TestCase
{
    public function test_a_file_with_tests_passes_the_gate(): void
    {
        $this->assertSame([], RequirePhaseTests::missingTests([__FILE__]));
    }

    public function test_a_missing_file_or_a_file_without_tests_fails_the_gate(): void
    {
        $missing = dirname(__DIR__).'/Architecture/NoSuchTest.php';
        $empty = dirname(__DIR__).'/Support/RequirePhaseTests.php';

        $this->assertSame([$missing, $empty], RequirePhaseTests::missingTests([$missing, $empty, __FILE__]));
    }

    public function test_the_gate_command_fails_on_an_empty_or_skipped_suite(): void
    {
        $this->assertSame(
            ['vendor/bin/phpunit', '--fail-on-empty-test-suite', '--fail-on-skipped', 'tests/Unit'],
            RequirePhaseTests::command(['tests/Unit']),
        );
    }
}
