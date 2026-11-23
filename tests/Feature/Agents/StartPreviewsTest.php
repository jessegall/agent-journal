<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Contracts\Drivers\DriverCatalogue;
use App\Enums\DriverSourceType;
use App\Enums\DriverVariant;
use App\Enums\ModeSourceType;
use App\Exceptions\DriverConflict;
use App\Models\Agent;
use App\Support\Capabilities\CodexTerminalCapabilities;
use App\Support\DefaultDrivers;
use App\Support\DriverRegistry;
use App\Support\StartPreviews;
use App\Values\DriverFamily;
use App\Values\DriverKey;
use App\Values\DriverRegistration;
use App\Values\ModelSelection;
use App\Values\ProfileDefaults;
use App\Values\ProviderKey;
use App\Values\StartPreview;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A start's preview resolves its family and its mode apart: the family named, pinned, from the profile or from the
 * parent, the mode named, saved, from the profile or the only one its family runs; a mode that cannot run here is
 * shown with its reason and never swapped.
 */
final class StartPreviewsTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_child_inherits_its_parents_family_and_a_named_family_wins_over_an_unpinned_profile(): void
    {
        $agent = Agent::create('Helper', 'read-only-helper');

        $inherited = $this->previewOf($agent, null, null, $this->profile(null), DefaultDrivers::CODEX);
        $claude = $this->profile(DefaultDrivers::CLAUDE_CODE);
        $named = $this->previewOf($agent, DefaultDrivers::CODEX, null, $claude, null);

        $this->assertSame(DefaultDrivers::CODEX, $inherited->selection->driver);
        $this->assertSame(DriverSourceType::ParentSession, $inherited->selection->source->driverSource);
        $this->assertSame(DriverSourceType::Explicit, $named->selection->source->driverSource);
    }

    public function test_a_profile_pinned_to_claude_refuses_codex(): void
    {
        $this->expectException(DriverConflict::class);

        $this->previews()->preview(
            Agent::create('Helper', 'read-only-helper'),
            DefaultDrivers::CODEX,
            null,
            ModelSelection::fromInput('opus'),
            $this->profile(DefaultDrivers::CLAUDE_CODE, pinned: true),
            null,
        );
    }

    public function test_the_mode_is_named_else_saved_else_the_profiles(): void
    {
        $agent = Agent::create('Helper', 'read-only-helper');
        $profile = $this->profile(DefaultDrivers::CLAUDE_CODE);

        $fromProfile = $this->previewOf($agent, null, null, $profile, null);
        $agent->preferVariant(DriverVariant::Terminal);
        $saved = $this->previewOf($agent, null, null, $profile, null);
        $named = $this->previewOf($agent, null, DriverVariant::Headless, $profile, null);

        $this->assertSame(
            [DriverVariant::Headless, ModeSourceType::Profile],
            [$fromProfile->mode, $fromProfile->modeSource],
        );
        $this->assertSame([DriverVariant::Terminal, ModeSourceType::Saved], [$saved->mode, $saved->modeSource]);
        $this->assertSame([DriverVariant::Headless, ModeSourceType::Explicit], [$named->mode, $named->modeSource]);
    }

    public function test_a_saved_terminal_that_cannot_run_here_stays_terminal_and_says_why(): void
    {
        $agent = Agent::create('Helper', 'read-only-helper');
        $agent->preferVariant(DriverVariant::Terminal);

        $preview = $this->previewOf($agent, DefaultDrivers::CODEX, null, $this->profile(null), null);

        $this->assertSame(DriverVariant::Terminal, $preview->mode);
        $this->assertFalse($preview->canRun());
        $this->assertSame(CodexTerminalCapabilities::NOT_PROVEN, $preview->unavailableReason);
    }

    public function test_a_family_that_runs_one_mode_locks_it(): void
    {
        $registry = $this->app->make(DriverCatalogue::class);
        $this->assertInstanceOf(DriverRegistry::class, $registry);
        $claude = $registry->family(DefaultDrivers::CLAUDE_CODE);
        $headless = $registry->forKey(DriverKey::from('claude-code-headless'))->descriptor();
        $registry->registerFamily(
            new DriverFamily('acme', 'Acme', ProviderKey::from('acme'), 'acme', $claude->isolatesHooksPerSession),
        );
        $registry->register(new DriverRegistration(
            DriverKey::from('acme-headless'),
            'acme',
            DriverVariant::Headless,
            'Acme headless',
            [],
            $headless->hookProtocol,
            $headless->accountProtocol,
            $headless->skillProtocol,
            $headless->capabilities,
            [],
        ));
        $agent = Agent::create('Helper', 'read-only-helper');
        $agent->preferVariant(DriverVariant::Terminal);

        $preview = $this->previewOf($agent, 'acme', null, $this->profile(null), null);

        $this->assertTrue($preview->isModeLocked);
        $this->assertSame([DriverVariant::Headless, ModeSourceType::OnlyMode], [$preview->mode, $preview->modeSource]);
        $this->assertSame('acme-headless', $preview->driverKey);
    }

    private function previewOf(
        Agent $agent,
        string|null $family,
        DriverVariant|null $mode,
        ProfileDefaults $profile,
        string|null $parentFamily,
    ): StartPreview {
        $model = ModelSelection::fromInput('opus');

        return $this->previews()->preview($agent, $family, $mode, $model, $profile, $parentFamily);
    }

    private function previews(): StartPreviews
    {
        return $this->app->make(StartPreviews::class);
    }

    private function profile(string|null $driver, bool $pinned = false): ProfileDefaults
    {
        return new ProfileDefaults('read-only-helper', 1, $driver, $pinned, 'opus', ['opus'], DriverVariant::Headless);
    }
}
