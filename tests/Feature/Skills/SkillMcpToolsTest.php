<?php

declare(strict_types=1);

namespace Tests\Feature\Skills;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Exceptions\ActorNotAllowed;
use App\Actors\Support\ActorContext;
use App\Bus\Contracts\CommandBus;
use App\Skills\Commands\CreateSkill\CreateSkillCommand;
use App\Skills\Commands\ReviseSkill\ReviseSkillCommand;
use App\Skills\Contracts\SkillResolver;
use App\Skills\Models\SkillRevision;
use App\Skills\Values\SectionDraft;
use App\Skills\Values\SkillDraft;
use App\Skills\Values\SkillKey;
use Domain\Access\Support\AccessSettings;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\ActsAsActors;
use Tests\Support\CommitsHookRows;
use Tests\Support\SendsMcpFrames;
use Tests\Support\TestActors;
use Tests\Support\TestStartAuthority;
use Tests\TestCase;

/**
 * Skills are read through their native and console surfaces, and an agent cannot edit them through the bus.
 */
final class SkillMcpToolsTest extends TestCase
{
    use ActsAsActors;
    use CommitsHookRows;
    use SendsMcpFrames;

    private const array TABLES = [
        'skill_publications',
        'skill_generations',
        'skill_requests',
        'skill_revisions',
        'skills',
        'number_groups',
        'command_receipts',
        'agents',
        'agent_sessions',
        'start_tokens',
        'agent_stacks',
    ];

    private TestStart $caller;

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->instance(AccessSettings::class, TestActors::accessSettings(7));
        $this->caller = TestStart::start();
    }

    public function test_skill_reads_stay_on_the_native_and_console_surfaces(): void
    {
        $this->caller->startRequest($this->app);
        $skill = $this->app->make(SkillResolver::class)->find(SkillKey::from('journal-skills'));
        $this->assertNotEmpty($skill->rendered->markdown);
        $this->sendMcp($this->caller, 'tools/call', [
            'name' => 'skills_show', 'arguments' => ['key' => 'journal-skills'],
        ])->assertBadRequest()->assertJsonPath('error.code', -32602);
        $this->sendMcp($this->caller, 'tools/call', [
            'name' => 'skills_list', 'arguments' => (object) [],
        ])->assertBadRequest()->assertJsonPath('error.code', -32602);
    }

    public function test_an_agent_edit_is_hidden_and_the_bus_refuses_the_same_write(): void
    {
        $this->actAs(TestActors::user(7));
        $created = $this->app->make(CommandBus::class)->run(
            new CreateSkillCommand(
                'user-review-notes',
                'create-1',
                new SkillDraft('Review notes', 'Read.', [new SectionDraft('notes', 'Notes', 'Text.')], ''),
            ),
        );

        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forAgent($this->caller->agent->id),
            TestStartAuthority::forAgent($this->caller->agent->id),
        );

        try {
            $this->app->make(CommandBus::class)->run(
                new ReviseSkillCommand(
                    $created->skillId,
                    1,
                    'revise-1',
                    new SkillDraft('Review notes', 'Read.', [new SectionDraft('notes', 'Notes', 'Other.')], ''),
                ),
            );
            $this->fail('The bus let an agent revise a skill.');
        } catch (ActorNotAllowed $refusal) {
            $this->assertNotEmpty($refusal->getMessage());
        }

        $this->sendMcp($this->caller, 'tools/call', [
            'name' => 'skills_edit',
            'arguments' => ['skill' => 'user-review-notes', 'expected_revision' => 1, 'body' => 'Other.'],
        ])->assertBadRequest()->assertJsonPath('error.code', -32602);

        $this->assertSame(1, SkillRevision::query()->count());
    }
}
