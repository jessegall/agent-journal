<?php

declare(strict_types=1);

namespace Tests\Feature\Skills;

use App\Commands\Skills\CreateSkill\CreateSkillCommand;
use App\Commands\Skills\ReviseSkill\ReviseSkillCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Exceptions\ActorNotAllowed;
use App\Models\Skills\SkillRevision;
use App\Support\Access\AccessSettings;
use App\Support\ActorContext;
use App\Values\SectionDraft;
use App\Values\SkillDraft;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\Support\TestStartAuthority;
use Tests\TestCase;

/**
 * Skills are read through their native and console surfaces, and an agent cannot edit them through the bus.
 */
final class SkillMcpToolsTest extends TestCase
{
    use CommitsHookRows;

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
        'session_tokens',
        'agent_stacks',
    ];

    private TestStart $caller;

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->instance(AccessSettings::class, TestActors::accessSettings(7));
        $this->caller = TestStart::start();
    }

    public function test_an_agent_edit_is_hidden_and_the_bus_refuses_the_same_write(): void
    {
        $this->journal->actAsUserId(TestIds::of(7));
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

        $this->journal->mcpRequest($this->caller, 'tools/call', [
            'name' => 'skills_edit',
            'arguments' => ['skill' => 'user-review-notes', 'expected_revision' => 1, 'body' => 'Other.'],
        ])->assertBadRequest()->assertJsonPath('error.code', -32602);

        $this->assertSame(1, SkillRevision::query()->count());
    }
}
