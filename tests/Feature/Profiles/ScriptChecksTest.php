<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Commands\Profiles\ActivateProfiles\ActivateProfilesCommand;
use App\Commands\Profiles\SaveProfileDraft\SaveProfileDraftCommand;
use App\Contracts\Bus\CommandBus;
use App\Models\Profiles\Profile;
use App\Models\Profiles\ProfileRevision;
use App\Support\ProfileProposal;
use App\Values\DraftExpectations;
use App\Values\ProfileKey;
use App\Values\ScriptSource;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\TestCase;

final class ScriptChecksTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['profile_draft_revisions', 'profile_drafts', 'profile_revisions', 'profiles'];

    public static function invalidScripts(): array
    {
        return [
            ["\xFF", 'invalid_form', 1, 1],
            ['ON STOP'."\n".'  CHECK workspace.missing'."\n".'END', 'unknown_member', 2, 9],
            ['ON STOP'."\n".'IF workspace.dirty', 'unclosed_block', 2, 1],
            ['ON STOP'."\n".'RUN missing'."\n".'END', 'unknown_command', 2, 5],
        ];
    }

    public function test_activation_freezes_the_source_graph_and_used_definition_digest(): void
    {
        $this->journal->actAsUserId(TestIds::of(1));
        $commands = $this->app->make(CommandBus::class);
        $profile = ProfileKey::from('scripted-review');
        $source = new ScriptSource("ON STOP\nYIELD \"Check again.\"\nEND");
        $commands->run(new SaveProfileDraftCommand($profile, 0, $source));
        $proposal = ProfileProposal::fromConfiguration(['profiles' => [
            $profile->key => ['base' => 'read-only-helper', 'tier' => 3],
        ]]);
        $commands->run(new ActivateProfilesCommand($proposal, DraftExpectations::fromOptions([$profile->key.'=1'])));

        $revision = ProfileRevision::findCurrentOf(Profile::findByKey($profile));
        $this->assertSame($source->toArray(), $revision->script_source->toArray());
        $script = $revision->script;
        $this->assertSame('line-2', $script->compiled->handlers['STOP']->entry);
        $this->assertSame(['STOP'], array_keys($script->compiled->handlers));
        $this->assertMatchesRegularExpression('/^[0-9a-f]{64}$/D', $script->compiled->definitionDigest);
    }
}
