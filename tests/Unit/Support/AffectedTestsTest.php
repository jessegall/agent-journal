<?php

declare(strict_types=1);

namespace Tests\Unit\Support;

use Tests\Support\AffectedTests;
use Tests\Support\AffectedTestSelection;
use Tests\TestCase;

/**
 * Picking the tests a change can break from the code's syntax trees, on a small tree of classes and tests.
 */
final class AffectedTestsTest extends TestCase
{
    private const string TREE = 'tests/Fixtures/AffectedTests';

    public function test_a_changed_class_reaches_the_tests_of_its_users_and_of_its_interface_but_no_other(): void
    {
        $selection = $this->affectedBy('app/Widget.php');

        $this->assertSame(
            ['tests/ShapeDrawerTest.php' => 1, 'tests/WidgetBoxTest.php' => 1, 'tests/WidgetTest.php' => 2],
            $selection->testMethodsByFile,
        );
        $this->assertFalse($selection->isRefused());
    }

    public function test_a_bound_class_reaches_the_tests_of_its_binding_and_a_listener_those_of_its_event(): void
    {
        $this->assertSame(['tests/PrinterTest.php'], $this->affectedBy('app/InkPrinter.php')->testFiles());
        $this->assertSame(['tests/PaperJamTest.php'], $this->affectedBy('app/ClearJam.php')->testFiles());
    }

    public function test_a_changed_test_file_runs_itself(): void
    {
        $this->assertSame(['tests/WidgetBoxTest.php'], $this->affectedBy('tests/WidgetBoxTest.php')->testFiles());
    }

    public function test_a_change_that_reaches_more_than_the_most_test_methods_is_refused(): void
    {
        $selection = $this->affectedBy('app/Crowded.php');

        $this->assertSame(['tests/CrowdedTest.php' => 101], $selection->testMethodsByFile);
        $this->assertTrue($selection->isRefused());
    }

    public function test_a_change_no_class_names_reaches_no_test(): void
    {
        $this->assertSame([], $this->affectedBy('config/journal.php')->testMethodsByFile);
    }

    private function affectedBy(string $file): AffectedTestSelection
    {
        return new AffectedTests(base_path(self::TREE))->for([$file]);
    }
}
