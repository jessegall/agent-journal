<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Contracts\Drivers\DriverCatalogue;
use App\Enums\DriverSourceType;
use App\Enums\DriverType;
use App\Enums\ModelTier;
use App\Enums\ModelSelectionType;
use App\Enums\StartRefusalType;
use App\Exceptions\DefaultUnavailable;
use App\Exceptions\DriverRequired;
use App\Exceptions\DriverUnsupported;
use App\Exceptions\ModelRequired;
use App\Support\DefaultDrivers;
use App\Values\ModelSelection;
use App\Values\ProfileDefaults;
use App\Values\SelectedDriver;
use PHPUnit\Framework\Attributes\DataProvider;
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

    public function test_default_keeps_the_requested_default_while_the_model_is_the_familys_at_the_profiles_tier(): void
    {
        $selected = SelectedDriver::resolve(
            null,
            ModelSelection::fromInput('default'),
            $this->profile(tier: ModelTier::Inventive),
            null,
            $this->app->make(DriverCatalogue::class),
        );

        $this->assertSame(ModelSelectionType::ProfileDefault, $selected->requested->type);
        $this->assertSame('gpt-6.2-sol', $selected->model);
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

    /**
     * @return iterable<string, array{string, ModelTier, string}>
     */
    public static function tierModels(): iterable
    {
        yield 'Claude Code, simplest' => [DefaultDrivers::CLAUDE_CODE, ModelTier::Simplest, 'haiku'];
        yield 'Claude Code, general' => [DefaultDrivers::CLAUDE_CODE, ModelTier::General, 'sonnet'];
        yield 'Claude Code, complex' => [DefaultDrivers::CLAUDE_CODE, ModelTier::Inventive, 'opus'];
        yield 'Claude Code, exceptional' => [DefaultDrivers::CLAUDE_CODE, ModelTier::Exceptional, 'fable'];
        yield 'Codex, simplest' => [DefaultDrivers::CODEX, ModelTier::Simplest, 'gpt-6-luna'];
        yield 'Codex, general' => [DefaultDrivers::CODEX, ModelTier::General, 'gpt-6.1-terra'];
        yield 'Codex, complex' => [DefaultDrivers::CODEX, ModelTier::Inventive, 'gpt-6.2-sol'];
        yield 'Codex, exceptional' => [DefaultDrivers::CODEX, ModelTier::Exceptional, 'gpt-6.2-astra'];
    }

    #[DataProvider('tierModels')]
    public function test_the_default_model_follows_the_profiles_tier_for_each_family(
        string $driver,
        ModelTier $tier,
        string $model,
    ): void {
        $selected = SelectedDriver::resolve(
            null,
            ModelSelection::profileDefault(),
            $this->profile($driver, $tier),
            null,
            $this->app->make(DriverCatalogue::class),
        );

        $this->assertSame($model, $selected->model);
    }

    public function test_any_driver_and_model_can_be_started_under_any_profile(): void
    {
        $selected = SelectedDriver::resolve(
            DefaultDrivers::CLAUDE_CODE,
            ModelSelection::named('any-model'),
            $this->profile(DefaultDrivers::CODEX, ModelTier::Simplest),
            null,
            $this->app->make(DriverCatalogue::class),
        );

        $this->assertSame([DefaultDrivers::CLAUDE_CODE, 'any-model'], [$selected->driver, $selected->model]);
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
        } catch (DefaultUnavailable|DriverRequired|DriverUnsupported $refusal) {
            $this->assertInstanceOf($class, $refusal);
            $this->assertSame([$reason, $wording], [$refusal->reason(), $refusal->getMessage()]);
        }
    }

    private function profile(
        string|null $driver = DefaultDrivers::CODEX,
        ModelTier $tier = ModelTier::General,
    ): ProfileDefaults {
        return new ProfileDefaults('journal-researcher', 4, $driver, $tier, DriverType::Headless);
    }
}
