<?php

declare(strict_types=1);

namespace Tests\Commands\Settings;

use App\Contracts\Settings\EnabledSettingsGroup;
use App\Contracts\Settings\SettingsResolver;
use App\Enums\Settings\SettingsOutcome;
use App\Values\Decimal;
use App\Values\SettingsChange;
use Domain\Rules\RulesDomain;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\InstallsCommandModules;
use Tests\Support\Settings\ChangesReviewsSettings;
use Tests\Support\Settings\UsesReviewsSettings;
use Tests\TestCase;

/**
 * The owner sets a decimal setting to its scale, and setting it to the same value again changes nothing.
 */
final class SetDecimalSettingTest extends TestCase
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

    public function test_a_decimal_setting_changes_once(): void
    {
        $this->assertChange(SettingsOutcome::Changed, 1, $this->runCommand($this->commands->decimal($this->reviews->weight, Decimal::parse('0.75'), 0)));
        $this->assertChange(SettingsOutcome::Unchanged, 1, $this->runCommand($this->commands->decimal($this->reviews->weight, Decimal::parse('0.75'), 1)));

        $this->assertTrue($this->reviewGroup()->decimal($this->reviews->weight)->isEqualTo(Decimal::parse('0.75')));
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
