<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Actors\Exceptions\ActorNotAllowed;
use App\Agents\Models\Agent;
use App\Bus\Contracts\CommandBus;
use App\Profiles\Commands\ActivateProfiles;
use App\Profiles\Commands\SaveProfileDraft;
use App\Profiles\Enums\CommandDirectory;
use App\Profiles\Exceptions\InvalidScript;
use App\Profiles\Exceptions\ProfileDraftRefused;
use App\Profiles\Models\ProfileDraft;
use App\Profiles\Models\ProfileDraftRevision;
use App\Profiles\Models\ProfileRevision;
use App\Profiles\Support\ProfileProposal;
use App\Profiles\Values\DraftExpectations;
use App\Profiles\Values\ProfileKey;
use App\Profiles\Values\ScriptSource;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;
use Tests\Support\TestIds;
use Tests\TestCase;

final class ProfileDraftTest extends TestCase
{
    use CommitsHookRows;
    use StartsAgentRequests;

    private const array TABLES = [
        'profile_draft_revisions', 'profile_drafts', 'profile_revisions', 'profiles', 'agents',
    ];

    private const array COMMANDS = [
        'tests' => [
            'executable' => '/usr/local/bin/composer',
            'arguments' => ['test:affected', '--no-interaction'],
            'directory' => 'workspace',
            'effects' => ['read:workspace', 'test:workspace'],
            'timeout_seconds' => 600,
        ],
    ];

    public function test_a_user_and_an_agent_share_a_draft_with_a_single_revision_counter(): void
    {
        $this->startTestUserRequest(1);
        $commands = $this->app->make(CommandBus::class);
        $profile = ProfileKey::from('draft-test');
        $actor = Agent::named('Editor', 'writing-helper');

        $this->assertSame(1, $commands->run(new SaveProfileDraft($profile, 0, new ScriptSource('syntax error'))));
        $this->startRequestAs($actor->id, TestIds::of(87));

        $draft = ScriptSource::fromDefinitions('RUN tests', self::COMMANDS);
        $this->assertSame(2, $commands->run(new SaveProfileDraft($profile, 1, $draft)));
        $this->assertThrows(
            fn () => $commands->run(new SaveProfileDraft($profile, 1, new ScriptSource())),
            ProfileDraftRefused::class,
            'revision 2',
        );

        $this->assertSame(1, ProfileDraft::query()->count());
        $this->assertSame(2, ProfileDraftRevision::query()->count());
        $latest = ProfileDraftRevision::query()->where('revision', 2)->sole();
        $this->assertSame($actor->id, $latest->getAttribute('author_id'));
        $this->assertEquals($draft, $latest->scriptSource());
        $this->assertSame(CommandDirectory::Workspace, $latest->scriptSource()->definitions()['tests']->directory);
        $this->assertThrows(fn () => $commands->run(new ActivateProfiles($this->proposal())), ActorNotAllowed::class);
    }

    public function test_activation_refuses_the_whole_proposal_if_a_saved_draft_changed(): void
    {
        $this->startTestUserRequest(1);
        $commands = $this->app->make(CommandBus::class);
        $profile = ProfileKey::from('draft-test');

        $commands->run(new SaveProfileDraft($profile, 0, new ScriptSource()));
        $activation = new ActivateProfiles($this->proposal(), DraftExpectations::fromOptions(['draft-test=1']));
        $first = $commands->run($activation);
        $this->assertTrue($first->profiles[0]->script->after->isEmpty());

        $commands->run(new SaveProfileDraft($profile, 1, new ScriptSource('RUN tests')));
        $this->assertThrows(fn () => $commands->run($activation), ProfileDraftRefused::class, 'revision 2');
        $updated = new ActivateProfiles($this->proposal(), DraftExpectations::fromOptions(['draft-test=2']));
        $this->assertThrows(
            fn () => $commands->run($updated),
            InvalidScript::class,
        );
        $this->assertSame(2, ProfileRevision::query()->count());
    }

    public function test_named_commands_require_an_absolute_executable_and_workspace_effects(): void
    {
        $definition = self::COMMANDS['tests'];

        $this->assertThrows(
            fn () => ScriptSource::fromDefinitions('', ['tests' => [...$definition, 'executable' => 'composer']]),
            ProfileDraftRefused::class,
        );
        $this->assertThrows(
            fn () => ScriptSource::fromDefinitions('', ['tests' => [...$definition, 'effects' => ['read:protected']]]),
            ProfileDraftRefused::class,
        );
    }

    private function proposal(): ProfileProposal
    {
        return ProfileProposal::fromConfiguration(['profiles' => [
            'draft-test' => ['base' => 'writing-helper', 'model' => 'opus'],
            'another-draft' => ['base' => 'writing-helper', 'model' => 'opus'],
        ]]);
    }
}
