<?php

declare(strict_types=1);

namespace Tests\Commands\Settings;

use App\Commands\Settings\EnableSettingGroup\EnableSettingGroupCommand;
use App\Contracts\Settings\EnabledSettingsGroup;
use App\Contracts\Settings\SettingsResolver;
use App\Enums\Settings\SettingsOutcome;
use App\Values\SettingsChange;
use Domain\Rules\RulesDomain;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\InstallsCommandModules;
use Tests\Support\Settings\ChangesReviewsSettings;
use Tests\Support\Settings\UsesReviewsSettings;
use Tests\TestCase;

/**
 * Switching a group off and on again keeps every saved setting.
 */
#[TestsCommand(EnableSettingGroupCommand::class)]
final class EnableSettingGroupTest extends TestCase
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

    public function test_switching_a_group_off_and_on_keeps_every_saved_setting(): void
    {
        $this->runCommand($this->commands->integer($this->reviews->retryLimit, 4, 0));
        $this->runCommand($this->commands->stringChoice($this->reviews->summaryStyle, 'long', 1));

        $this->assertChange(
            SettingsOutcome::Changed,
            3,
            $this->runCommand($this->commands->disable($this->reviews->review, 2)),
        );

        $this->assertChange(
            SettingsOutcome::Unchanged,
            3,
            $this->runCommand($this->commands->disable($this->reviews->review, 3)),
        );

        $this->assertChange(
            SettingsOutcome::Changed,
            4,
            $this->runCommand($this->commands->enable($this->reviews->review, 3)),
        );

        $review = $this->reviewGroup();
        $this->assertSame(4, $review->integer($this->reviews->retryLimit));
        $this->assertSame('long', $review->choice($this->reviews->summaryStyle));
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
