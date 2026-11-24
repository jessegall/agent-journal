<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Bus\CommandFacts;
use App\Contracts\Bus\CommandTransaction;
use App\Contracts\Settings\Setting;
use App\Declarations\ToggleGroup;
use App\Enums\SettingsOutcome;
use App\Enums\SettingTarget;
use App\Events\Settings\SettingsChanged;
use App\Exceptions\CommandTransactionMissing;
use App\Exceptions\SettingDisabled;
use App\Exceptions\SettingsConflict;
use App\Exceptions\SettingStorageInvalid;
use App\Models\Records\SettingsRecord;
use App\Support\Storage\EncodedSetting;
use App\Support\Storage\EncodedToggle;
use App\Support\Storage\EncodedValue;
use App\Support\Storage\SettingsDocument;
use App\Values\SettingsChange;

/**
 * Changes one owner's stored settings inside the running bus command: it makes the owner's record when there is none,
 * locks it, refuses a stale revision, and stores a change as exactly one new revision. Whoever calls it has checked
 * access and the value already.
 *
 * @internal
 */
final readonly class SettingsWriter
{
    public function __construct(
        private CommandTransaction $transaction,
        private SettingRegistry $registry,
        private SettingCodec $codec,
        private DatabaseSettingsResolver $resolver,
        private CommandFacts $facts,
    ) {}

    /**
     * Stores the value as the setting's override; the same encoding already stored changes nothing.
     *
     * @throws CommandTransactionMissing
     * @throws SettingsConflict
     * @throws SettingDisabled
     * @throws SettingStorageInvalid
     */
    public function setValue(Setting $setting, EncodedValue $encodedSetting, int $expectedRevision): SettingsChange
    {
        $owner = $this->registry->ownerOf($setting)->owner;
        $record = $this->lockedRecord($owner, $setting->key(), $expectedRevision);
        $this->requireGroupEnabled($record, $setting);

        if ($record->document
            ->setting($setting->key())
            ->filter(fn (EncodedSetting $stored) => $stored->encodedSetting->equals($encodedSetting))
            ->isDefined()) {
            return $this->unchanged($record);
        }

        return $this->revise(
            $record,
            $record->document->withSetting(new EncodedSetting($setting->key(), $encodedSetting)),
            SettingTarget::Setting,
            $setting->key(),
        );
    }

    /**
     * Removes the setting's override without reading it, keeping every other entry; no override changes nothing.
     *
     * @throws CommandTransactionMissing
     * @throws SettingsConflict
     * @throws SettingDisabled
     * @throws SettingStorageInvalid
     */
    public function reset(Setting $setting, int $expectedRevision): SettingsChange
    {
        $owner = $this->registry->ownerOf($setting)->owner;
        $record = $this->lockedRecord($owner, $setting->key(), $expectedRevision);
        $this->requireGroupEnabled($record, $setting);

        if ($record->document->setting($setting->key())->isEmpty()) {
            return $this->unchanged($record);
        }

        return $this->revise(
            $record,
            $record->document->withoutSetting($setting->key()),
            SettingTarget::Setting,
            $setting->key(),
        );
    }

    /**
     * Switches the group on or off without touching its settings; the same stored switch changes nothing. A stored
     * switch that is not a boolean is replaced without being read.
     *
     * @throws CommandTransactionMissing
     * @throws SettingsConflict
     */
    public function setToggle(ToggleGroup $group, bool $isEnabled, int $expectedRevision): SettingsChange
    {
        $owner = $this->registry->ownerOf($group)->owner;
        $record = $this->lockedRecord($owner, $group->key, $expectedRevision);
        $encodedToggle = EncodedValue::of($isEnabled);

        if ($record->document
            ->toggle($group->key)
            ->filter(fn (EncodedToggle $stored) => $stored->encodedToggle->equals($encodedToggle))
            ->isDefined()) {
            return $this->unchanged($record);
        }

        return $this->revise(
            $record,
            $record->document->withToggle(new EncodedToggle($group->key, $encodedToggle)),
            SettingTarget::Group,
            $group->key,
        );
    }

    /**
     * Removes the group's stored switch without reading it, so the group follows its declared default; its settings
     * keep their values. No stored switch changes nothing.
     *
     * @throws CommandTransactionMissing
     * @throws SettingsConflict
     */
    public function resetToggle(ToggleGroup $group, int $expectedRevision): SettingsChange
    {
        $owner = $this->registry->ownerOf($group)->owner;
        $record = $this->lockedRecord($owner, $group->key, $expectedRevision);

        if ($record->document->toggle($group->key)->isEmpty()) {
            return $this->unchanged($record);
        }

        return $this->revise($record, $record->document->withoutToggle($group->key), SettingTarget::Group, $group->key);
    }

    /**
     * The owner's record, made at revision 0 when absent and locked, at the revision the change was made against.
     *
     * @throws CommandTransactionMissing
     * @throws SettingsConflict
     */
    private function lockedRecord(string $owner, string $key, int $expectedRevision): SettingsRecord
    {
        $this->transaction->assertRunning(new SettingsRecord()->getConnection());
        SettingsRecord::makeEmptyFor($owner);
        $record = SettingsRecord::lockedForOwner($owner);

        if ($record->revision !== $expectedRevision) {
            throw SettingsConflict::for($owner, $key, $expectedRevision, $record->revision);
        }

        return $record;
    }

    /**
     * Refuses a change to a setting whose group is switched off, or whose group switch is stored wrongly.
     *
     * @throws SettingDisabled
     * @throws SettingStorageInvalid
     */
    private function requireGroupEnabled(SettingsRecord $record, Setting $setting): void
    {
        $group = $this->registry->groupOf($setting);

        if (! $group instanceof ToggleGroup) {
            return;
        }

        $stored = new StoredSettings(
            $record->owner,
            $record->revision,
            $record->document,
            $this->codec,
            $this->registry,
        );

        if ($stored->group($group) instanceof DisabledSettingsGroup) {
            throw SettingDisabled::for($record->owner, $setting->key(), $group->key);
        }
    }

    private function unchanged(SettingsRecord $record): SettingsChange
    {
        return new SettingsChange($record->owner, $record->revision, SettingsOutcome::Unchanged);
    }

    /**
     * Stores the document as the next revision and announces it once the command's transaction commits.
     */
    private function revise(
        SettingsRecord $record,
        SettingsDocument $document,
        SettingTarget $target,
        string $key,
    ): SettingsChange {
        $record->revise($document);
        $this->resolver->forget($record->owner);
        $this->facts->publishAfterCommit(new SettingsChanged($record->owner, $target, $key, $record->revision));

        return new SettingsChange($record->owner, $record->revision, SettingsOutcome::Changed);
    }
}
