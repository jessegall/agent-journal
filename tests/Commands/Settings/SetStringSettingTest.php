<?php

declare(strict_types=1);

namespace Tests\Commands\Settings;

use App\Commands\Settings\SetStringSetting\SetStringSettingCommand;
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
 * The owner sets a text setting, and setting it to the same text again changes nothing.
 */
#[TestsCommand(SetStringSettingCommand::class)]
final class SetStringSettingTest extends TestCase
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

    private const string TITLE = 'Code reviews';

    public function test_a_text_setting_changes_once(): void
    {
        $this->assertChange(
            SettingsOutcome::Changed,
            1,
            $this->runCommand($this->commands->string($this->reviews->title, self::TITLE, 0)),
        );
        $this->assertChange(
            SettingsOutcome::Unchanged,
            1,
            $this->runCommand($this->commands->string($this->reviews->title, self::TITLE, 1)),
        );

        $this->assertSame(self::TITLE, $this->settings()->string($this->reviews->title));
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
