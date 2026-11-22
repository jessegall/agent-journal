<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Contracts\DriverCatalogue;
use App\Enums\DriverSourceType;
use App\Enums\DriverVariant;
use App\Enums\ModelSelectionType;
use App\Enums\StartRefusalType;
use App\Exceptions\DefaultUnavailable;
use App\Exceptions\DriverConflict;
use App\Exceptions\DriverRequired;
use App\Exceptions\DriverUnsupported;
use App\Exceptions\ModelRequired;
use App\Exceptions\ModelUnavailable;
use App\Support\DefaultDrivers;
use App\Values\ModelSelection;
use App\Values\ProfileDefaults;
use App\Values\SelectedDriver;
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
            $this->app->make(DriverCatalogue::class),
        );

        $this->assertSame(ModelSelectionType::ProfileDefault, $selected->requested->type);
        $this->assertSame('gpt-5-codex', $selected->model);
        $this->assertSame(DefaultDrivers::CODEX, $selected->driver);
        $this->assertSame(
            [DriverSourceType::Profile, 'journal-researcher', 4],
            [$selected->source->driverSource, $selected->source->profileKey, $selected->source->profileRevision],
        );
    }

    public function test_a_main_start_with_an_explicit_program_records_no_profile(): void
    {
        $selected = SelectedDriver::resolve('claude-code', ModelSelection::named('claude-opus-5-5'), null, null, $this->app->make(DriverCatalogue::class));

        $this->assertSame(
            [DefaultDrivers::CLAUDE_CODE, 'claude-opus-5-5', ModelSelectionType::Named],
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
            $this->app->make(DriverCatalogue::class),
        );

        $this->assertSame(
            [DefaultDrivers::CLAUDE_CODE, DriverSourceType::ParentSession],
            [$selected->driver, $selected->source->driverSource],
        );
    }

    public function test_a_supplied_program_wins_over_an_open_profile_program(): void
    {
        $selected = SelectedDriver::resolve('claude-code', ModelSelection::named('m'), $this->profile(), null, $this->app->make(DriverCatalogue::class));

        $this->assertSame(
            [DefaultDrivers::CLAUDE_CODE, DriverSourceType::Explicit],
            [$selected->driver, $selected->source->driverSource],
        );
    }

    public function test_each_refusal_has_its_reason_and_wording(): void
    {
        $this->assertRefused(
            DefaultUnavailable::class,
            StartRefusalType::DefaultUnavailable,
            DefaultUnavailable::forStart()->getMessage(),
            fn () => SelectedDriver::resolve('codex', ModelSelection::profileDefault(), null, null, $this->app->make(DriverCatalogue::class)),
        );
        $this->assertRefused(
            DriverRequired::class,
            StartRefusalType::DriverRequired,
            DriverRequired::forStart()->getMessage(),
            fn () => SelectedDriver::resolve(null, ModelSelection::named('m'), null, null, $this->app->make(DriverCatalogue::class)),
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
                $this->app->make(DriverCatalogue::class),
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
                $this->app->make(DriverCatalogue::class),
            ),
        );
        $this->assertRefused(
            DriverUnsupported::class,
            StartRefusalType::DriverUnsupported,
            DriverUnsupported::for('gemini')->getMessage(),
            fn () => SelectedDriver::resolve('gemini', ModelSelection::named('m'), null, null, $this->app->make(DriverCatalogue::class)),
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
        string|null $driver = DefaultDrivers::CODEX,
        bool $pinned = false,
        string|null $defaultModel = null,
        array $allowedModels = [],
    ): ProfileDefaults {
        return new ProfileDefaults('journal-researcher', 4, $driver, $pinned, $defaultModel, $allowedModels, DriverVariant::Headless);
    }
}
