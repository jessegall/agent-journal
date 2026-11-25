<?php

declare(strict_types=1);

namespace Tests\Middleware;

use App\CommandMiddleware\GuardCommandProject;
use App\Commands\Agents\CreateAgent\CreateAgentCommand;
use App\Contracts\Actors\CurrentActor;
use App\Enums\CommandRules\ReceiptStatus;
use App\Exceptions\CrossProjectWrite;
use App\Exceptions\RecordUnavailable;
use App\Models\Agents\Agent;
use App\Support\CommandCall;
use App\Support\Projects\ProjectSelectionStore;
use App\Values\ProjectOwner;
use App\Values\ProjectSelection;
use Tests\Fixtures\Projects\OwnedWrite;
use Tests\Support\Entries\Attributes\TestsMiddleware;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A command that writes a project's record passes only where its sender works: one selected project writes only
 * there and Global only for the owner, All writes any existing project or Global, and None writes nothing.
 */
#[TestsMiddleware(GuardCommandProject::class)]
final class GuardCommandProjectTest extends TestCase
{
    use RefreshHookDatabase;

    private const string PASSED = 'passed';

    private const string MISSING_PROJECT = '01jd8x0g9m3qz6v4k2t7r5w1cz';

    public function test_an_agent_naming_another_project_is_refused_with_a_receipt_and_no_row(): void
    {
        $this->journal->owner()->project('Shop')->agent('Ada')->actAs('Ada');
        $command = new CreateAgentCommand('Stranger', 'main-agent', $this->journal->projectCalled('Shop')->id);

        $this->journal->assertRefused(CrossProjectWrite::class, fn () => $this->journal->run($command, 'key-1'));

        $this->journal->assertReceiptStatus(
            $this->journal->commandReceipt($command, 'key-1'),
            ReceiptStatus::Refused,
        );
        $this->assertSame(0, Agent::query()->where('name', 'Stranger')->count());
    }

    public function test_an_agent_writes_its_own_project_and_not_global(): void
    {
        $this->journal->owner()->agent('Ada')->actAs('Ada');
        $own = $this->journal->agentCalled('Ada')->project_id;

        $this->assertSame(self::PASSED, $this->guard(ProjectOwner::ofProject($own)));
        $this->assertGuardRefuses(ProjectOwner::global());
    }

    public function test_an_owner_on_one_project_writes_it_and_global_but_not_another(): void
    {
        $this->journal->owner()->project('Shop')->project('Blog')->selectProject('Shop');

        $this->assertSame(self::PASSED, $this->guard(ProjectOwner::ofProject($this->projectId('Shop'))));
        $this->assertSame(self::PASSED, $this->guard(ProjectOwner::global()));
        $this->assertGuardRefuses(ProjectOwner::ofProject($this->projectId('Blog')));
    }

    public function test_the_owner_in_all_projects_writes_any_existing_project_or_global(): void
    {
        $this->journal->owner()->project('Shop')->inAllProjects();

        $this->assertSame(self::PASSED, $this->guard(ProjectOwner::ofProject($this->projectId('Shop'))));
        $this->assertSame(self::PASSED, $this->guard(ProjectOwner::global()));
    }

    public function test_a_project_that_does_not_exist_is_refused_as_unavailable(): void
    {
        $this->journal->owner()->inAllProjects();
        $command = new CreateAgentCommand('Stranger', 'main-agent', self::MISSING_PROJECT);

        $this->journal->assertRefused(RecordUnavailable::class, fn () => $this->journal->run($command));
    }

    public function test_work_pinned_to_an_agent_writes_only_that_agents_project(): void
    {
        $this->journal->owner()->project('Shop')->agent('Ada');
        $own = $this->journal->agentCalled('Ada')->project_id;
        $store = $this->app->make(ProjectSelectionStore::class);

        $store->within(ProjectSelection::of($own), function () use ($own): void {
            $this->assertSame(self::PASSED, $this->guard(ProjectOwner::ofProject($own)));
            $this->assertGuardRefuses(ProjectOwner::ofProject($this->projectId('Shop')));
        });
    }

    public function test_none_writes_nothing(): void
    {
        $this->journal->owner()->project('Shop');

        $this->app->make(ProjectSelectionStore::class)->within(ProjectSelection::none(), function (): void {
            $this->assertGuardRefuses(ProjectOwner::ofProject($this->projectId('Shop')));
            $this->assertGuardRefuses(ProjectOwner::global());
        });
    }

    private function guard(ProjectOwner $owner): mixed
    {
        $call = CommandCall::of(
            new OwnedWrite($owner),
            'core',
            false,
            false,
            $this->app->make(CurrentActor::class)->actor(),
        );

        return $this->app->make(GuardCommandProject::class)->handle($call, fn (): string => self::PASSED);
    }

    private function assertGuardRefuses(ProjectOwner $owner): void
    {
        $this->journal->assertRefused(CrossProjectWrite::class, fn () => $this->guard($owner));
    }

    private function projectId(string $name): string
    {
        return $this->journal->projectCalled($name)->id;
    }
}
