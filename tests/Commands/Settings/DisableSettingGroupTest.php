<?php

declare(strict_types=1);

namespace Tests\Commands\Settings;

use App\Contracts\Settings\EnabledSettingsGroup;
use App\Contracts\Settings\SettingsResolver;
use App\Enums\Settings\SettingsOutcome;
use App\Values\SettingsChange;
use Domain\Rules\RulesDomain;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\InstallsCommandModules;
use Tests\Support\Settings\ChangesReviewsSettings;
use Tests\Support\Settings\UsesReviewsSettings;
use Tests\TestCase;

/**
 * The owner switches a group off once, its settings kept, and switching it off again changes nothing.
 */
final class DisableSettingGroupTest extends TestCase
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

    public function test_a_group_is_switched_off_once(): void
    {
        $this->assertChange(SettingsOutcome::Changed, 1, $this->runCommand($this->commands->disable($this->reviews->review, 0)));
        $this->assertChange(SettingsOutcome::Unchanged, 1, $this->runCommand($this->commands->disable($this->reviews->review, 1)));

        $this->app->forgetScopedInstances();
        $this->assertNotInstanceOf(EnabledSettingsGroup::class, $this->app->make(SettingsResolver::class)->group($this->reviews->review));
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
