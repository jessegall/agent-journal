<?php

declare(strict_types=1);

namespace Tests\Middleware;

use App\CommandMiddleware\RefuseWritesDuringEvaluation;
use App\Commands\Layouts\SaveLayout\SaveLayoutCommand;
use App\Data\Layouts\LayoutShape;
use App\Exceptions\ConditionWriteRefused;
use App\Models\Records\Layout;
use App\Support\EvaluationGuard;
use Tests\Commands\Layouts\SaveLayoutTest;
use Tests\Support\Entries\Attributes\TestsMiddleware;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * Before its transaction, every command run while a skill condition evaluates is refused and writes nothing; once the
 * evaluation ends, the same command runs.
 */
#[TestsMiddleware(RefuseWritesDuringEvaluation::class)]
final class RefuseWritesDuringEvaluationTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_command_run_while_a_condition_evaluates_is_refused_and_writes_nothing(): void
    {
        $this->journal->owner()->actAs('Owner');
        $command = new SaveLayoutCommand('Writing', LayoutShape::from(SaveLayoutTest::shape('chat')));

        $this->assertThrows(
            fn () => $this->app->make(EvaluationGuard::class)->during(fn () => $this->journal->run($command)),
            ConditionWriteRefused::class,
        );
        $this->assertSame(0, Layout::query()->count());

        $this->journal->run($command);
        $this->assertSame(1, Layout::query()->count());
    }
}
