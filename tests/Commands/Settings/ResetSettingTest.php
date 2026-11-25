<?php

declare(strict_types=1);

namespace Tests\Commands\Settings;

use App\Enums\Settings\SettingsOutcome;
use App\Models\Records\SettingsRecord;
use App\Support\Storage\EncodedSetting;
use App\Support\Storage\EncodedValue;
use App\Support\Storage\SettingsDocument;
use App\Values\SettingsChange;
use Domain\Rules\RulesDomain;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\InstallsCommandModules;
use Tests\Support\Settings\ChangesReviewsSettings;
use Tests\Support\Settings\UsesReviewsSettings;
use Tests\TestCase;

/**
 * Resetting one invalid override removes only it and keeps its siblings byte for byte, and resetting a setting
 * without an override changes nothing.
 */
final class ResetSettingTest extends TestCase
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

    public function test_resetting_one_invalid_override_removes_only_it_and_keeps_its_siblings_byte_for_byte(): void
    {
        $this->storeDirectly(fn (SettingsDocument $document) => $document
            ->withSetting(new EncodedSetting('retry_limit', EncodedValue::of('not a number')))
            ->withSetting(new EncodedSetting('weight', EncodedValue::of('0.75')))
            ->withSetting(new EncodedSetting('summary_style', EncodedValue::of([1, 2])))
            ->withSetting(new EncodedSetting('retired_key', EncodedValue::of(true))));

        $before = $this->storedText();

        $this->assertChange(
            SettingsOutcome::Changed,
            2,
            $this->runCommand($this->commands->reset($this->reviews->retryLimit, 1)),
        );

        $this->assertSame(
            str_replace('{"key":"retry_limit","value":"not a number"},', '', $before),
            $this->storedText(),
        );
    }

    public function test_resetting_a_setting_without_an_override_changes_nothing(): void
    {
        $this->assertChange(
            SettingsOutcome::Unchanged,
            0,
            $this->runCommand($this->commands->reset($this->reviews->title, 0)),
        );
    }

    private function assertChange(SettingsOutcome $outcome, int $revision, SettingsChange $change): void
    {
        $this->assertSame(['Reviews', $revision, $outcome], [$change->owner, $change->revision, $change->outcome]);
    }

    private function storedText(): string
    {
        return (string) SettingsRecord::query()->where('owner', 'Reviews')->sole()->getRawOriginal('document');
    }
}
