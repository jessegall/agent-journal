<?php

declare(strict_types=1);

namespace Tests\Commands\Settings;

use App\Settings\Commands\ResetSettingGroup\ResetSettingGroupCommand;
use App\Settings\Contracts\EnabledSettingsGroup;
use App\Settings\Contracts\SettingsResolver;
use App\Settings\Enums\SettingsOutcome;
use App\Settings\Exceptions\SettingStorageInvalid;
use App\Settings\Storage\EncodedEntry;
use App\Settings\Storage\EncodedValue;
use App\Settings\Values\SettingsChange;
use App\Support\Storage\SettingsDocument;
use Domain\Rules\RulesDomain;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\InstallsCommandModules;
use Tests\Support\Settings\ChangesReviewsSettings;
use Tests\Support\Settings\UsesReviewsSettings;
use Tests\TestCase;

/**
 * Resetting an invalid switch makes the group follow its default with its settings intact.
 */
#[TestsCommand(ResetSettingGroupCommand::class)]
final class ResetSettingGroupTest extends TestCase
{
    use ChangesReviewsSettings;
    use CommitsHookRows;
    use InstallsCommandModules;
    use UsesReviewsSettings;

    /**
     * Rules, which the Notes test module requires.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(RulesDomain::class);
    }

    /**
     * The bus commits the settings commands for real, so this table is emptied around each test.
     */
    private const array TABLES = ['settings_records'];

    public function test_resetting_an_invalid_switch_makes_the_group_follow_its_default_with_its_settings_intact(): void
    {
        $this->storeDirectly(fn (SettingsDocument $document) => $document
            ->withToggle(new EncodedEntry('review', EncodedValue::of('on')))
            ->withSetting(new EncodedEntry('retry_limit', EncodedValue::of(6))));

        $this->assertRefused(SettingStorageInvalid::class, $this->commands->integer($this->reviews->retryLimit, 4, 1));

        $this->assertChange(
            SettingsOutcome::Changed,
            2,
            $this->runCommand($this->commands->resetGroup($this->reviews->review, 1)),
        );

        $this->assertChange(
            SettingsOutcome::Unchanged,
            2,
            $this->runCommand($this->commands->resetGroup($this->reviews->review, 2)),
        );

        $this->assertSame(6, $this->reviewGroup()->integer($this->reviews->retryLimit));
    }

    private function assertChange(SettingsOutcome $outcome, int $revision, SettingsChange $change): void
    {
        $this->assertSame(['Reviews', $revision, $outcome], [$change->owner, $change->revision, $change->outcome]);
    }

    private function reviewGroup(): EnabledSettingsGroup
    {
        $this->app->forgetScopedInstances();
        $group = $this->app->make(SettingsResolver::class)->group($this->reviews->review);
        $this->assertInstanceOf(EnabledSettingsGroup::class, $group);

        return $group;
    }
}
