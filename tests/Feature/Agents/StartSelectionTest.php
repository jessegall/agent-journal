<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Agents\Enums\DriverSourceType;
use App\Agents\Enums\DriverVariant;
use App\Agents\Enums\ModelSelectionType;
use App\Agents\Enums\StartRefusalType;
use App\Agents\Exceptions\DefaultUnavailable;
use App\Agents\Exceptions\DriverConflict;
use App\Agents\Exceptions\DriverRequired;
use App\Agents\Exceptions\DriverUnsupported;
use App\Agents\Exceptions\ModelRequired;
use App\Agents\Exceptions\ModelUnavailable;
use App\Agents\Values\ModelSelection;
use App\Agents\Values\ProfileDefaults;
use App\Agents\Values\SelectedDriver;
use App\Drivers\Enums\HookDriver;
use Tests\TestCase;

/**
 * A start always names a model, and its driver comes from the caller, the profile or the parent session, in that
 * order; every refusal has its stable reason and the design's wording.
 */
final class StartSelectionTest extends TestCase
{
    public function test_missing_and_blank_model_input_is_refused_as_model_required(): void
    {
        foreach ([null, '', '   '] as $input) {
            try {
                ModelSelection::fromInput($input);
                $this->fail('A start without a model was accepted.');
            } catch (ModelRequired $refusal) {
                $this->assertSame(StartRefusalType::ModelRequired, $refusal->reason());
                $this->assertSame(
                    ModelRequired::forStart()->getMessage(),
                    $refusal->getMessage(),
                );
            }
        }
    }

    public function test_default_keeps_the_requested_default_while_the_model_is_the_profiles_concrete_one(): void
    {
        $selected = SelectedDriver::resolve(
            null,
            ModelSelection::fromInput('default'),
            $this->profile(defaultModel: 'gpt-5-codex'),
            null,
        );

        $this->assertSame(ModelSelectionType::ProfileDefault, $selected->requested->type);
        $this->assertSame('gpt-5-codex', $selected->model);
        $this->assertSame(HookDriver::Codex, $selected->driver);
        $this->assertSame(
            [DriverSourceType::Profile, 'journal-researcher', 4],
            [$selected->source->driverSource, $selected->source->profileKey, $selected->source->profileRevision],
        );
    }

    public function test_a_main_start_with_an_explicit_program_records_no_profile(): void
    {
        $selected = SelectedDriver::resolve('claude-code', ModelSelection::named('claude-opus-5-5'), null, null);

        $this->assertSame(
            [HookDriver::ClaudeCode, 'claude-opus-5-5', ModelSelectionType::Named],
            [$selected->driver, $selected->model, $selected->requested->type],
        );
        $this->assertSame(
            [DriverSourceType::Explicit, null, null],
            [$selected->source->driverSource, $selected->source->profileKey, $selected->source->profileRevision],
        );
    }

    public function test_an_open_profile_leaves_the_program_to_the_parent_session(): void
    {
        $selected = SelectedDriver::resolve(
            null,
            ModelSelection::named('m'),
            $this->profile(driver: null),
            'claude-code',
        );

        $this->assertSame(
            [HookDriver::ClaudeCode, DriverSourceType::ParentSession],
            [$selected->driver, $selected->source->driverSource],
        );
    }

    public function test_a_supplied_program_wins_over_an_open_profile_program(): void
    {
        $selected = SelectedDriver::resolve('claude-code', ModelSelection::named('m'), $this->profile(), null);

        $this->assertSame(
            [HookDriver::ClaudeCode, DriverSourceType::Explicit],
            [$selected->driver, $selected->source->driverSource],
        );
    }

    public function test_each_refusal_has_its_reason_and_wording(): void
    {
        $this->assertRefused(
            DefaultUnavailable::class,
            StartRefusalType::DefaultUnavailable,
            DefaultUnavailable::forStart()->getMessage(),
            fn () => SelectedDriver::resolve('codex', ModelSelection::profileDefault(), null, null),
        );
        $this->assertRefused(
            DriverRequired::class,
            StartRefusalType::DriverRequired,
            DriverRequired::forStart()->getMessage(),
            fn () => SelectedDriver::resolve(null, ModelSelection::named('m'), null, null),
        );
        $this->assertRefused(
            DriverConflict::class,
            StartRefusalType::DriverConflict,
            DriverConflict::for('journal-researcher', 'claude-code')->getMessage(),
            fn () => SelectedDriver::resolve(
                'claude-code',
                ModelSelection::named('m'),
                $this->profile(pinned: true),
                null,
            ),
        );
        $this->assertRefused(
            ModelUnavailable::class,
            StartRefusalType::ModelUnavailable,
            ModelUnavailable::for('gpt-4', 'codex')->getMessage(),
            fn () => SelectedDriver::resolve(
                null,
                ModelSelection::named('gpt-4'),
                $this->profile(allowedModels: ['gpt-5-codex']),
                null,
            ),
        );
        $this->assertRefused(
            DriverUnsupported::class,
            StartRefusalType::DriverUnsupported,
            DriverUnsupported::for('gemini')->getMessage(),
            fn () => SelectedDriver::resolve('gemini', ModelSelection::named('m'), null, null),
        );
    }

    /**
     * @param  class-string<\Throwable>  $class
     */
    private function assertRefused(string $class, StartRefusalType $reason, string $wording, \Closure $start): void
    {
        try {
            $start();
            $this->fail("{$reason->value} was not refused.");
        } catch (DefaultUnavailable|DriverRequired|DriverConflict|ModelUnavailable|DriverUnsupported $refusal) {
            $this->assertInstanceOf($class, $refusal);
            $this->assertSame([$reason, $wording], [$refusal->reason(), $refusal->getMessage()]);
        }
    }

    /**
     * @param  list<string>  $allowedModels
     */
    private function profile(
        HookDriver|null $driver = HookDriver::Codex,
        bool $pinned = false,
        string|null $defaultModel = null,
        array $allowedModels = [],
    ): ProfileDefaults {
        return new ProfileDefaults('journal-researcher', 4, $driver, $pinned, $defaultModel, $allowedModels, DriverVariant::Headless);
    }
}
