<?php

declare(strict_types=1);

namespace Tests\Unit\Projects;

use App\Contracts\Admission\JournalAdmission;
use App\Contracts\Projects\AgentProjects;
use App\Support\ActorReference;
use App\Support\ActorStore;
use App\Support\Projects\CurrentProject;
use App\Values\InboxMemberAuthority;
use App\Values\OwnerAuthority;
use App\Values\ProjectSelection;
use App\Values\StackTarget;
use App\Values\TrustedEntryAuthority;
use PHPUnit\Framework\TestCase;
use RuntimeException;
use Tests\Support\Projects\BuildsCurrentProject;

/**
 * Each row of how CurrentProject answers, by who acts, and a pinned target that is given back also on a throw.
 */
final class CurrentProjectTest extends TestCase
{
    use BuildsCurrentProject;

    public const string AGENT_OF_A = '01jd8x0g9m3qz6v4k2t7r5w1ca';

    public const string AGENT_OF_B = '01jd8x0g9m3qz6v4k2t7r5w1cb';

    public const string PROJECT_A = '01jd8x0g9m3qz6v4k2t7r5w1cc';

    public const string PROJECT_B = '01jd8x0g9m3qz6v4k2t7r5w1cd';

    private const string USER = '01jd8x0g9m3qz6v4k2t7r5w1ce';

    private ActorStore $actors;

    /**
     * How often the fake directory was asked for an agent's project.
     */
    private int $projectReads = 0;

    private bool $admitsUser = false;

    protected function setUp(): void
    {
        parent::setUp();

        $this->actors = new ActorStore();
    }

    public function test_an_agent_reads_its_own_project_and_its_choice_is_never_read(): void
    {
        $store = $this->store();
        $this->actors->set(ActorReference::forAgent(self::AGENT_OF_A), new TrustedEntryAuthority('agent'));

        $store->select(ProjectSelection::of(self::PROJECT_B));

        $this->assertEquals(ProjectSelection::of(self::PROJECT_A), $store->selection());
    }

    public function test_an_agents_project_is_read_once_per_request(): void
    {
        $store = $this->store();
        $this->actors->set(ActorReference::forAgent(self::AGENT_OF_A), new TrustedEntryAuthority('agent'));

        $store->selection();
        $store->selection();

        $this->assertSame(1, $this->projectReads);
    }

    public function test_the_journal_reads_all_projects_outside_a_pinned_target(): void
    {
        $store = $this->store();
        $this->actors->set(ActorReference::system(), new TrustedEntryAuthority('engine'));

        $this->assertEquals(ProjectSelection::all(), $store->selection());
    }

    public function test_the_journal_reads_the_target_agents_project_while_pinned(): void
    {
        $store = $this->store();
        $this->actors->set(ActorReference::system(), new TrustedEntryAuthority('engine'));

        $inside = $store->forTarget(
            new StackTarget(self::AGENT_OF_B, 'session'),
            fn (): ProjectSelection => $store->selection(),
        );

        $this->assertEquals(ProjectSelection::of(self::PROJECT_B), $inside);
        $this->assertEquals(ProjectSelection::all(), $store->selection());
    }

    public function test_a_pinned_target_answers_also_under_the_actor_that_raised_the_fact(): void
    {
        $store = $this->store();
        $this->actors->set(ActorReference::forUser(self::USER), new OwnerAuthority('web'));
        $store->select(ProjectSelection::of(self::PROJECT_A));

        $inside = $store->forTarget(
            new StackTarget(self::AGENT_OF_B, 'session'),
            fn (): ProjectSelection => $store->selection(),
        );

        $this->assertEquals(ProjectSelection::of(self::PROJECT_B), $inside);
        $this->assertEquals(ProjectSelection::of(self::PROJECT_A), $store->selection());
    }

    public function test_the_earlier_selection_comes_back_when_the_pinned_work_throws(): void
    {
        $store = $this->store();
        $this->actors->set(ActorReference::system(), new TrustedEntryAuthority('engine'));

        $store->within(ProjectSelection::none(), function () use ($store): void {
            try {
                $store->forTarget(new StackTarget(self::AGENT_OF_A, 'session'), function (): never {
                    throw new RuntimeException();
                });
            } catch (RuntimeException) {
                $this->assertEquals(ProjectSelection::none(), $store->selection());
            }
        });

        $this->assertEquals(ProjectSelection::all(), $store->selection());
    }

    public function test_an_owner_reads_the_selected_project_else_all(): void
    {
        $store = $this->store();
        $this->actors->set(ActorReference::forUser(self::USER), new OwnerAuthority('web'));

        $this->assertEquals(ProjectSelection::all(), $store->selection());

        $store->select(ProjectSelection::of(self::PROJECT_A));

        $this->assertEquals(ProjectSelection::of(self::PROJECT_A), $store->selection());
    }

    public function test_a_user_the_admission_admits_is_an_owner(): void
    {
        $this->admitsUser = true;
        $store = $this->store();
        $this->actors->set(ActorReference::forUser(self::USER), new TrustedEntryAuthority('console'));

        $this->assertEquals(ProjectSelection::all(), $store->selection());
    }

    public function test_an_inbox_member_reads_none_whatever_was_selected(): void
    {
        $this->admitsUser = true;
        $store = $this->store();
        $this->actors->set(ActorReference::forUser(self::USER), new InboxMemberAuthority('web'));

        $store->select(ProjectSelection::of(self::PROJECT_A));

        $this->assertEquals(ProjectSelection::none(), $store->selection());
    }

    public function test_a_user_the_admission_refuses_reads_none(): void
    {
        $store = $this->store();
        $this->actors->set(ActorReference::forUser(self::USER), new TrustedEntryAuthority('web'));

        $this->assertEquals(ProjectSelection::none(), $store->selection());
    }

    public function test_no_actor_reads_none(): void
    {
        $this->assertEquals(ProjectSelection::none(), $this->store()->selection());
    }

    private function store(): CurrentProject
    {
        $admission = $this->createStub(JournalAdmission::class);
        $admission->method('admits')->willReturnCallback(fn (): bool => $this->admitsUser);

        return $this->currentProject($this->actors, $this->agentProjects(), $admission);
    }

    private function agentProjects(): AgentProjects
    {
        return new class($this->projectReads) implements AgentProjects
        {
            public function __construct(private int &$reads) {}

            public function projectIdOf(string $agentId): string
            {
                $this->reads++;

                return [
                    CurrentProjectTest::AGENT_OF_A => CurrentProjectTest::PROJECT_A,
                    CurrentProjectTest::AGENT_OF_B => CurrentProjectTest::PROJECT_B,
                ][$agentId];
            }
        };
    }
}
