<?php

declare(strict_types=1);

namespace Tests\Commands\Settings;

use App\Settings\Commands\SetBooleanSetting\SetBooleanSettingCommand;
use App\Settings\Contracts\EnabledSettingsGroup;
use App\Settings\Contracts\SettingsResolver;
use App\Settings\Enums\SettingsOutcome;
use App\Settings\Values\SettingsChange;
use Domain\Rules\RulesDomain;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\InstallsCommandModules;
use Tests\Support\Settings\ChangesReviewsSettings;
use Tests\Support\Settings\UsesReviewsSettings;
use Tests\TestCase;

/**
 * The owner sets a yes or no setting, and setting it to the same value again changes nothing.
 */
#[TestsCommand(SetBooleanSettingCommand::class)]
final class SetBooleanSettingTest extends TestCase
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

    public function test_a_yes_or_no_setting_changes_once(): void
    {
        $this->assertChange(SettingsOutcome::Changed, 1, $this->runCommand($this->commands->boolean($this->reviews->notifyOwner, false, 0)));
        $this->assertChange(SettingsOutcome::Unchanged, 1, $this->runCommand($this->commands->boolean($this->reviews->notifyOwner, false, 1)));

        $this->assertFalse($this->reviewGroup()->boolean($this->reviews->notifyOwner));
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
