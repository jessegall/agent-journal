<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Commands\Profiles\ActivateProfiles\ActivateProfilesCommand;
use App\Commands\Profiles\SaveProfileDraft\SaveProfileDraftCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Domains\DomainAvailability;
use App\Contracts\Scripts\ScriptChecks;
use App\Models\Profiles\Profile;
use App\Models\Profiles\ProfileRevision;
use App\Support\ProfileProposal;
use App\Support\ScriptKeywordRegistration;
use App\Values\DraftExpectations;
use App\Values\ProfileKey;
use App\Values\ScriptSource;
use App\Values\TextOperand;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Fixtures\Scripts\ExampleScriptKeyword;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\TestCase;

final class ScriptChecksTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['profile_draft_revisions', 'profile_drafts', 'profile_revisions', 'profiles'];

    public function test_a_stop_branch_uses_one_compiled_graph_with_named_ports(): void
    {
        $source = ScriptSource::fromDefinitions(<<<'SCRIPT'
ON STOP
IF workspace.dirty
  RUN tests
  YIELD "Check the results before committing."
END
END
SCRIPT, ['tests' => [
            'executable' => '/usr/local/bin/composer',
            'arguments' => ['test:affected'],
            'directory' => 'workspace',
            'effects' => ['read', 'test'],
            'timeout_seconds' => 600,
        ]]);

        $check = $this->app->make(ScriptChecks::class)->check($source);

        $this->assertSame([], $check->diagnostics);
        $this->assertNotNull($check->compiled);
        $compiled = $check->compiled;
        $this->assertSame('line-2', $compiled->handlers['STOP']->entry);
        $this->assertSame([
            'true' => 'line-3',
            'false' => 'final-checks',
            'failure' => 'return-policy',
        ], $compiled->instructions['line-2']->successors);
        $this->assertSame(['returned' => 'return-policy'], $compiled->instructions['line-4']->successors);
    }

    #[DataProvider('invalidScripts')]
    public function test_invalid_scripts_have_named_diagnostics_and_no_graph(
        string $source,
        string $code,
        int $line,
        int $column,
    ): void {
        $check = $this->app->make(ScriptChecks::class)->check(new ScriptSource($source));

        $this->assertNull($check->compiled);
        $diagnostic = $check->diagnostics[0];
        $this->assertSame([$code, $line, $column], [$diagnostic->code, $diagnostic->line, $diagnostic->column]);
        $this->assertGreaterThan(0, $diagnostic->length);
    }

    public static function invalidScripts(): array
    {
        return [
            ["\xFF", 'invalid_form', 1, 1],
            ['ON STOP'."\n".'  CHECK workspace.missing'."\n".'END', 'unknown_member', 2, 9],
            ['ON STOP'."\n".'IF workspace.dirty', 'unclosed_block', 2, 1],
            ['ON STOP'."\n".'RUN missing'."\n".'END', 'unknown_command', 2, 5],
        ];
    }

    public function test_an_external_text_statement_uses_the_same_parser(): void
    {
        $this->app->make(ScriptKeywordRegistration::class)->registerOwned('Review', ExampleScriptKeyword::definition());
        $this->mock(DomainAvailability::class)->shouldReceive('isEnabled')->with('Review')->andReturn(true);
        $this->app->make(DomainAvailability::class)->shouldReceive('isEnabled')->with('Core')->andReturn(true);
        $source = new ScriptSource("ON STOP\nNOTE \"Retain \\\"évidence\\\".\"\nEND");

        $check = $this->app->make(ScriptChecks::class)->check($source);

        $this->assertSame([], $check->diagnostics);
        $this->assertNotNull($check->compiled);
        $step = $check->compiled->instructions['line-2'];
        $this->assertSame('NOTE', $step->keyword);
        $this->assertEquals(new TextOperand('Retain "évidence".'), $step->operand);
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
