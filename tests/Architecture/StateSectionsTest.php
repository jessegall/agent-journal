<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Symfony\Component\Process\Process;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A state lays out its methods as the state machine reads them: the constructor, its reference makers and its own
 * answers first under no marker, then Lifecycle, Hooks, Events and Internals.
 * tools/refactoring/state-sections.php lists every fault.
 */
#[TimeLimit(seconds: 60, reason: 'It parses every PHP file of app and domain.')]
final class StateSectionsTest extends TestCase
{
    public function test_every_state_lays_out_its_methods_in_order(): void
    {
        $this->assertSame('', trim($this->checkOutput('app', 'domain')));
    }

    public function test_an_own_answer_among_the_hooks_and_hooks_out_of_order_are_flagged(): void
    {
        $output = $this->checkOutput('tests/Fixtures/StateSections/MisplacedState.php');
        preg_match_all('/\t(?:method|hook) (\w+)/', $output, $flagged);

        $this->assertSame(['instruction', 'onSessionStart'], $flagged[1]);
    }

    public function test_a_state_with_its_own_answers_and_no_sections_is_clean(): void
    {
        $this->assertSame('', trim($this->checkOutput('tests/Fixtures/Hooks/StateLoading/KeptValuesState.php')));
    }

    private function checkOutput(string ...$paths): string
    {
        $check = new Process([PHP_BINARY, 'tools/refactoring/state-sections.php', ...$paths], base_path());
        $check->run();

        return $check->getOutput();
    }
}
