<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Fixtures;

use Domain\Tasks\Tests\TestCase;
use Tests\Support\RefreshHookDatabase;

/**
 * An agent mid task, a second task the same worker starts and another worker's task stand side by side in one journal,
 * each with its own run and claim.
 */
final class StartScenariosTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_second_task_of_the_same_worker_and_a_task_of_another_worker_keep_their_own_runs(): void
    {
        $first = $this->journal->startScenario(AgentMidTask::class);
        $second = $this->journal->startScenario(new StartNamedTask(owner: 'Jo', worker: 'Writer', task: 'Edit'));
        $this->journal->agent('Reviewer');
        $other = $this->journal->startScenario(new StartNamedTask(owner: 'Jo', worker: 'Reviewer', task: 'Read'));

        $this->assertSame($first->session->id, $second->session->id);
        $this->assertNotSame($first->session->id, $other->session->id);

        $this->assertSame(
            [$first->task->id, $second->task->id, $other->task->id],
            [$first->run->task_id, $second->run->task_id, $other->run->task_id],
        );

        $this->journal->fixtures(TaskFixtures::class)
            ->assertStarted('Draft', by: 'Writer')
            ->assertStarted('Edit', by: 'Writer')
            ->assertStarted('Read', by: 'Reviewer');
    }
}
