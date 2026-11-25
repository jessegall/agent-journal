<?php

declare(strict_types=1);

namespace Tests\Commands\Profiles;

use App\Commands\Profiles\ActivateProfiles\ActivateProfilesCommand;
use App\Commands\Profiles\SaveProfileDraft\SaveProfileDraftCommand;
use App\Contracts\Bus\CommandBus;
use App\Enums\Profiles\CommandDirectory;
use App\Exceptions\CommandAdmissionRefused;
use App\Exceptions\InvalidScript;
use App\Exceptions\ProfileDraftRefused;
use App\Models\Agents\Agent;
use App\Models\Profiles\ProfileDraft;
use App\Models\Profiles\ProfileDraftRevision;
use App\Models\Profiles\ProfileRevision;
use App\Support\ProfileProposal;
use App\Values\DraftExpectations;
use App\Values\ProfileKey;
use App\Values\ScriptSource;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\TestCase;

final class SaveProfileDraftTest extends TestCase
{
    use CommitsHookRows;

    private const string REVISION_TWO = 'revision 2';

    private const array TABLES = [
        'profile_draft_revisions', 'profile_drafts', 'profile_revisions', 'profiles', 'agents',
    ];

    private const array COMMANDS = [
        'tests' => [
            'executable' => '/usr/local/bin/composer',
            'arguments' => ['test:affected', '--no-interaction'],
            'directory' => 'workspace',
            'effects' => ['read', 'test'],
            'timeout_seconds' => 600,
        ],
    ];

    public function test_a_user_and_an_agent_share_a_draft_with_a_single_revision_counter(): void
    {
        $this->journal->actAsUserId(TestIds::of(1));
        $commands = $this->app->make(CommandBus::class);
        $profile = ProfileKey::from('draft-test');
        $actor = Agent::create('Editor', 'writing-helper', $this->localProject());

        $this->assertSame(1, $commands->run(new SaveProfileDraftCommand($profile, 0, new ScriptSource('syntax error'))));
        $this->journal->actAsAgentIds($actor->id, TestIds::of(87));

        $draft = ScriptSource::fromDefinitions('RUN tests', self::COMMANDS);
        $this->assertSame(2, $commands->run(new SaveProfileDraftCommand($profile, 1, $draft)));
        $this->assertThrows(
            fn () => $commands->run(new SaveProfileDraftCommand($profile, 1, ScriptSource::none())),
            ProfileDraftRefused::class,
            self::REVISION_TWO,
        );

        $this->assertSame(1, ProfileDraft::query()->count());
        $this->assertSame(2, ProfileDraftRevision::query()->count());
        $latest = ProfileDraftRevision::query()->where('revision', 2)->sole();
        $this->assertSame($actor->id, $latest->getAttribute('author_id'));
        $this->assertSame($draft->toArray(), $latest->script_source->toArray());
        $this->assertSame(CommandDirectory::Workspace, $latest->script_source->definitions()['tests']->directory);
        $this->assertThrows(
            fn () => $commands->run(new ActivateProfilesCommand($this->proposal())),
            CommandAdmissionRefused::class,
        );
    }

    public function test_activation_refuses_the_whole_proposal_if_a_saved_draft_changed(): void
    {
        $this->journal->actAsUserId(TestIds::of(1));
        $commands = $this->app->make(CommandBus::class);
        $profile = ProfileKey::from('draft-test');

        $commands->run(new SaveProfileDraftCommand($profile, 0, ScriptSource::none()));
        $activation = new ActivateProfilesCommand($this->proposal(), DraftExpectations::fromOptions(['draft-test=1']));
        $first = $commands->run($activation);
        $this->assertTrue($first->profiles[0]->script->after->isEmpty());

        $commands->run(new SaveProfileDraftCommand($profile, 1, new ScriptSource('RUN tests')));
        $this->assertThrows(fn () => $commands->run($activation), ProfileDraftRefused::class, self::REVISION_TWO);
        $updated = new ActivateProfilesCommand($this->proposal(), DraftExpectations::fromOptions(['draft-test=2']));
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
            'draft-test' => ['base' => 'writing-helper', 'tier' => 3],
            'another-draft' => ['base' => 'writing-helper', 'tier' => 3],
        ]]);
    }
}
