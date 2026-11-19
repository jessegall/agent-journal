<?php

declare(strict_types=1);

namespace Tests\Feature\Skills;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorContext;
use App\Actors\Support\ActorIdentity;
use App\Agents\Enums\AgentRole;
use App\Domains\Support\DomainRegistry;
use App\Numbers\Models\NumberGroup;
use App\Programs\Values\ProgramKey;
use App\Programs\Values\ProviderKey;
use App\Skills\Enums\ConditionOutcome;
use App\Skills\Exceptions\ConditionWriteRefused;
use App\Skills\Exceptions\SkillConditionInvalid;
use App\Skills\Support\ConditionRegistry;
use App\Skills\Support\ConditionTree;
use App\Skills\Values\LaunchProfile;
use App\Skills\Values\SkillConditionRegistration;
use App\Skills\Values\SkillContext;
use Illuminate\Contracts\Debug\ExceptionHandler;
use Mockery;
use Tests\Fixtures\Modules\Cards\CardsDomain;
use Tests\Fixtures\Modules\Notes\Models\Note;
use Tests\Fixtures\Modules\Notes\NotesDomain;
use Tests\Fixtures\Skills\Writing\NoParameters;
use Tests\Fixtures\Skills\Writing\WritesDuringEvaluation;
use Tests\Support\CommitsHookRows;
use Tests\Support\InstallsNotesModule;
use Tests\Support\TestIds;
use Tests\Support\TestLaunchAuthority;
use Tests\TestCase;
use Throwable;

/**
 * A module registers a named condition that reads its own facts; the condition is refused any write while it
 * evaluates, and without its module it is unavailable while its source is kept.
 */
final class NamedConditionsTest extends TestCase
{
    use CommitsHookRows;
    use InstallsNotesModule;

    private const array TABLES = ['number_groups'];

    private const array HAS_TWO_NOTES = ['type' => 'named', 'version' => 1, 'key' => 'notes.has-notes', 'parameters' => ['atLeast' => 2]];

    protected function setUp(): void
    {
        parent::setUp();

        $this->createNotesTables();
        $this->installNotesModule();
    }

    protected function tearDown(): void
    {
        $this->dropNotesTables();

        parent::tearDown();
    }

    public function test_the_fixture_leaf_reads_its_own_notes_and_a_changed_fact_changes_the_next_result(): void
    {
        $this->useRegistry($this->installedRegistry());
        $condition = $this->app->make(ConditionTree::class)->hydrate(self::HAS_TWO_NOTES);

        $this->writeNote('One');
        $this->assertSame(ConditionOutcome::NoMatch, $condition->evaluate($this->context())->outcome);

        $this->writeNote('Two');
        $this->assertSame(ConditionOutcome::Match, $condition->evaluate($this->context())->outcome);
        $this->assertSame(self::HAS_TWO_NOTES, $condition->toArray());
    }

    public function test_without_the_module_the_leaf_is_unavailable_and_keeps_its_source(): void
    {
        $this->useRegistry(ConditionRegistry::of([]));
        $condition = $this->app->make(ConditionTree::class)->hydrate(self::HAS_TWO_NOTES);

        $this->assertSame(ConditionOutcome::Unavailable, $condition->evaluate($this->context())->outcome);
        $this->assertSame('condition-missing', $condition->evaluate($this->context())->reason);
        $this->assertSame(self::HAS_TWO_NOTES, $condition->toArray());
    }

    public function test_a_command_run_inside_an_evaluator_is_refused_and_the_leaf_is_unavailable(): void
    {
        $reported = [];
        $handler = Mockery::mock(ExceptionHandler::class);
        $handler->shouldReceive('report')->andReturnUsing(function (Throwable $failure) use (&$reported): void {
            $reported[] = $failure;
        });
        $this->app->instance(ExceptionHandler::class, $handler);
        $this->useRegistry(ConditionRegistry::of(['Notes' => [new SkillConditionRegistration('notes.writes', 1, NoParameters::class, WritesDuringEvaluation::class)]]));
        $groups = NumberGroup::query()->count();
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forAgent('evaluating-agent'), TestLaunchAuthority::forAgent('evaluating-agent'));

        $result = $this->app->make(ConditionTree::class)->hydrate(['type' => 'named', 'version' => 1, 'key' => 'notes.writes', 'parameters' => []])->evaluate($this->context());

        $this->assertSame(ConditionOutcome::Unavailable, $result->outcome);
        $this->assertSame('condition-failed', $result->reason);
        $this->assertInstanceOf(ConditionWriteRefused::class, $reported[0]);
        $this->assertSame($groups, NumberGroup::query()->count());
    }

    public function test_parameters_or_a_version_that_do_not_fit_the_registration_are_refused(): void
    {
        $this->useRegistry($this->installedRegistry());

        $this->expectException(SkillConditionInvalid::class);
        $this->expectExceptionMessage('condition.parameters does not fit notes.has-notes');

        $this->app->make(ConditionTree::class)->hydrate(['type' => 'named', 'version' => 1, 'key' => 'notes.has-notes', 'parameters' => ['atLeast' => 'many']]);
    }

    private function installedRegistry(): ConditionRegistry
    {
        /** @var list<string> $domainClasses */
        $domainClasses = require base_path('bootstrap/domains.php');

        return ConditionRegistry::of(DomainRegistry::from([...$domainClasses, CardsDomain::class, NotesDomain::class])->skillConditionDeclarations());
    }

    private function useRegistry(ConditionRegistry $registry): void
    {
        $this->app->instance(ConditionRegistry::class, $registry);
    }

    private function writeNote(string $text): void
    {
        $note = new Note(['text' => $text]);
        $note->saveFor(TestIds::of(5));
    }

    private function context(): SkillContext
    {
        return new SkillContext(new ActorIdentity(ActorType::Agent, TestIds::of(5)), AgentRole::MainAgent, TestIds::of(6), 'main', LaunchProfile::profileFree(), ProgramKey::from('codex'), ProviderKey::from('openai'));
    }
}
