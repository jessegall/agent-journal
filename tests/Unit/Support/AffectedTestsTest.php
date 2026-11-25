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

    public function test_the_tests_are_ranked_by_step_and_then_by_how_many_of_the_steps_classes_they_name(): void
    {
        $selection = $this->affectedBy('app/Widget.php');

        $this->assertSame(
            ['tests/WidgetShapeTest.php', 'tests/ShapeDrawerTest.php', 'tests/WidgetTest.php', 'tests/WidgetBoxTest.php'],
            $selection->testFiles(),
        );
        $this->assertSame(0, $selection->leftOut);
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

    public function test_past_the_most_test_methods_a_file_is_cut_by_method_and_the_rest_is_left_out(): void
    {
        $selection = $this->affectedBy('app/Crowded.php');

        $this->assertSame(range(1, 100), array_map(
            fn (string $method) => (int) substr($method, strlen('test_')),
            $selection->testsByFile['tests/CrowdedTest.php']['methods'],
        ));
        $this->assertSame(1, $selection->leftOut);
        $this->assertMatchesRegularExpression($selection->filter(), 'Fixture\Tests\CrowdedTest::test_100');
        $this->assertDoesNotMatchRegularExpression($selection->filter(), 'Fixture\Tests\CrowdedTest::test_101');
    }

    public function test_a_change_no_class_names_reaches_no_test(): void
    {
        $this->assertSame([], $this->affectedBy('config/journal.php')->testsByFile);
    }

    public function test_every_architecture_test_runs_whole_beside_the_nearest_tests_and_outside_their_count(): void
    {
        $crowded = $this->affectedBy('app/Crowded.php');
        $unreached = $this->affectedBy('config/journal.php');
        $architecture = ['tests/Architecture/LayersTest.php' => 'Fixture\Tests\Architecture\LayersTest'];

        $this->assertSame(100, $crowded->methodCount());
        $this->assertSame($architecture, $crowded->wholeTests);
        $this->assertSame(['tests/CrowdedTest.php', 'tests/Architecture/LayersTest.php'], $crowded->runFiles());
        $this->assertMatchesRegularExpression($crowded->filter(), 'Fixture\Tests\Architecture\LayersTest::test_names');
        $this->assertSame(['tests/Architecture/LayersTest.php'], $unreached->runFiles());
    }

    private function affectedBy(string $file): AffectedTestSelection
    {
        return new AffectedTests(base_path(self::TREE))->for([$file]);
    }
}
