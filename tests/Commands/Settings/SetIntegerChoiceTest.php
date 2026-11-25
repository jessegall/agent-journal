<?php

declare(strict_types=1);

namespace Tests\Commands\Settings;

use App\Commands\Settings\SetIntegerChoice\SetIntegerChoiceCommand;
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
 * The owner picks one of a setting's numbered choices, and picking it again changes nothing.
 */
#[TestsCommand(SetIntegerChoiceCommand::class)]
final class SetIntegerChoiceTest extends TestCase
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

    public function test_a_numbered_choice_changes_once(): void
    {
        $this->assertChange(SettingsOutcome::Changed, 1, $this->runCommand($this->commands->integerChoice($this->reviews->priority, 1, 0)));
        $this->assertChange(SettingsOutcome::Unchanged, 1, $this->runCommand($this->commands->integerChoice($this->reviews->priority, 1, 1)));

        $this->assertSame(1, $this->settings()->choice($this->reviews->priority));
    }

    private function assertChange(SettingsOutcome $outcome, int $revision, SettingsChange $change): void
    {
        $this->assertSame(['Reviews', $revision, $outcome], [$change->owner, $change->revision, $change->outcome]);
    }

    private function settings(): SettingsResolver
    {
        $this->app->forgetScopedInstances();

        return $this->app->make(SettingsResolver::class);
    }
}
