<?php

declare(strict_types=1);

namespace Tests\Commands\Settings;

use App\Settings\Commands\SetStringChoice\SetStringChoiceCommand;
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
 * The owner picks one of a setting's named choices, and picking it again changes nothing.
 */
#[TestsCommand(SetStringChoiceCommand::class)]
final class SetStringChoiceTest extends TestCase
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

    public function test_a_named_choice_changes_once(): void
    {
        $this->assertChange(SettingsOutcome::Changed, 1, $this->runCommand($this->commands->stringChoice($this->reviews->summaryStyle, 'long', 0)));
        $this->assertChange(SettingsOutcome::Unchanged, 1, $this->runCommand($this->commands->stringChoice($this->reviews->summaryStyle, 'long', 1)));

        $this->assertSame('long', $this->reviewGroup()->choice($this->reviews->summaryStyle));
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
