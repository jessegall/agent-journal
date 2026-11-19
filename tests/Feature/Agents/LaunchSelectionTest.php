<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Agents\Enums\LaunchRefusalType;
use App\Agents\Enums\ModelSelectionType;
use App\Agents\Enums\ProgramSourceType;
use App\Agents\Exceptions\DefaultUnavailable;
use App\Agents\Exceptions\ModelRequired;
use App\Agents\Exceptions\ModelUnavailable;
use App\Agents\Exceptions\ProgramConflict;
use App\Agents\Exceptions\ProgramRequired;
use App\Agents\Exceptions\ProgramUnsupported;
use App\Agents\Support\ModelSelection;
use App\Agents\Support\ProfileDefaults;
use App\Agents\Support\SelectedProgram;
use App\Programs\Enums\HookProgram;
use Tests\TestCase;

/**
 * A launch always names a model, and its program comes from the caller, the profile or the parent session, in that
 * order; every refusal has its stable reason and the design's wording.
 */
final class LaunchSelectionTest extends TestCase
{
    public function test_missing_and_blank_model_input_is_refused_as_model_required(): void
    {
        foreach ([null, '', '   '] as $input) {
            try {
                ModelSelection::fromInput($input);
                $this->fail('A launch without a model was accepted.');
            } catch (ModelRequired $refusal) {
                $this->assertSame(LaunchRefusalType::ModelRequired, $refusal->reason());
                $this->assertSame(
                    'Name a model: use --model <model> or --model default with a configured profile default. Nothing was launched.',
                    $refusal->getMessage(),
                );
            }
        }
    }

    public function test_default_keeps_the_requested_default_while_the_model_is_the_profiles_concrete_one(): void
    {
        $selected = SelectedProgram::resolve(
            null,
            ModelSelection::fromInput('default'),
            $this->profile(defaultModel: 'gpt-5-codex'),
            null,
        );

        $this->assertSame(ModelSelectionType::ProfileDefault, $selected->requested->type);
        $this->assertSame('gpt-5-codex', $selected->model);
        $this->assertSame(HookProgram::Codex, $selected->program);
        $this->assertSame(
            [ProgramSourceType::Profile, 'journal-researcher', 4],
            [$selected->source->programSource, $selected->source->profileKey, $selected->source->profileRevision],
        );
    }

    public function test_a_main_launch_with_an_explicit_program_records_no_profile(): void
    {
        $selected = SelectedProgram::resolve('claude-code', ModelSelection::named('claude-opus-5-5'), null, null);

        $this->assertSame(
            [HookProgram::ClaudeCode, 'claude-opus-5-5', ModelSelectionType::Named],
            [$selected->program, $selected->model, $selected->requested->type],
        );
        $this->assertSame(
            [ProgramSourceType::Explicit, null, null],
            [$selected->source->programSource, $selected->source->profileKey, $selected->source->profileRevision],
        );
    }

    public function test_an_open_profile_leaves_the_program_to_the_parent_session(): void
    {
        $selected = SelectedProgram::resolve(
            null,
            ModelSelection::named('m'),
            $this->profile(program: null),
            'claude-code',
        );

        $this->assertSame(
            [HookProgram::ClaudeCode, ProgramSourceType::ParentSession],
            [$selected->program, $selected->source->programSource],
        );
    }

    public function test_a_supplied_program_wins_over_an_open_profile_program(): void
    {
        $selected = SelectedProgram::resolve('claude-code', ModelSelection::named('m'), $this->profile(), null);

        $this->assertSame(
            [HookProgram::ClaudeCode, ProgramSourceType::Explicit],
            [$selected->program, $selected->source->programSource],
        );
    }

    public function test_each_refusal_has_its_reason_and_wording(): void
    {
        $this->assertRefused(
            DefaultUnavailable::class,
            LaunchRefusalType::DefaultUnavailable,
            'This launch has no configured model default. Name a model, or select a profile with an allowed default.',
            fn () => SelectedProgram::resolve('codex', ModelSelection::profileDefault(), null, null),
        );
        $this->assertRefused(
            ProgramRequired::class,
            LaunchRefusalType::ProgramRequired,
            'Name a program for this main-agent launch, or select a profile that defines one.',
            fn () => SelectedProgram::resolve(null, ModelSelection::named('m'), null, null),
        );
        $this->assertRefused(
            ProgramConflict::class,
            LaunchRefusalType::ProgramConflict,
            'Profile journal-researcher cannot run on claude-code. Choose a permitted program or profile.',
            fn () => SelectedProgram::resolve('claude-code', ModelSelection::named('m'), $this->profile(pinned: true), null),
        );
        $this->assertRefused(
            ModelUnavailable::class,
            LaunchRefusalType::ModelUnavailable,
            'Model gpt-4 is not allowed for codex with this profile. Name an allowed model. Nothing was launched.',
            fn () => SelectedProgram::resolve(null, ModelSelection::named('gpt-4'), $this->profile(allowedModels: ['gpt-5-codex']), null),
        );
        $this->assertRefused(
            ProgramUnsupported::class,
            LaunchRefusalType::ProgramUnsupported,
            'The journal cannot run the program gemini. Name claude-code or codex.',
            fn () => SelectedProgram::resolve('gemini', ModelSelection::named('m'), null, null),
        );
    }

    /**
     * @param  class-string<\Throwable>  $class
     */
    private function assertRefused(string $class, LaunchRefusalType $reason, string $wording, \Closure $launch): void
    {
        try {
            $launch();
            $this->fail("{$reason->value} was not refused.");
        } catch (DefaultUnavailable|ProgramRequired|ProgramConflict|ModelUnavailable|ProgramUnsupported $refusal) {
            $this->assertInstanceOf($class, $refusal);
            $this->assertSame([$reason, $wording], [$refusal->reason(), $refusal->getMessage()]);
        }
    }

    /**
     * @param  list<string>  $allowedModels
     */
    private function profile(
        HookProgram|null $program = HookProgram::Codex,
        bool $pinned = false,
        string|null $defaultModel = null,
        array $allowedModels = [],
    ): ProfileDefaults {
        return new ProfileDefaults('journal-researcher', 4, $program, $pinned, $defaultModel, $allowedModels);
    }
}
