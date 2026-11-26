<?php

declare(strict_types=1);

namespace Tests\Machinery\Seeding;

use App\Models\Records\SettingsRecord;
use App\Settings\CoreSettings;
use App\Settings\Exceptions\SettingsDocumentInvalid;
use App\Settings\SettingRegistry;
use App\Values\ProfileBase;
use App\Values\ProfileKey;
use App\Values\ScriptSource;
use Tests\Fixtures\Profiles\TestProposals;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\Seeding\TestJournal;
use Tests\TestCase;

/**
 * The journal installs the built-in profiles only when a test asks, saves drafts and activates profiles through
 * their commands, and changes, reads and breaks a stored setting.
 */
#[TestsMachinery(TestJournal::class)]
final class JournalProfilesTest extends TestCase
{
    use CommitsHookRows;

    /**
     * The profile and settings commands commit for real, so these tables are emptied around each test.
     */
    protected const array TABLES = [
        'profile_draft_revisions', 'profile_drafts', 'profile_revisions', 'profiles', 'settings_records', 'command_receipts',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();
    }

    public function test_the_built_in_profiles_are_installed_only_when_asked(): void
    {
        $main = ProfileKey::from('main-agent');
        $this->assertThrows(fn () => $this->journal->assertProfileActive($main));

        $this->journal->installProfiles()->assertProfileActive($main);
    }

    public function test_a_saved_draft_and_an_activated_profile_read_back_as_their_saved_revision(): void
    {
        $draft = ProfileKey::from('draft-test');
        $reviewer = TestProposals::profile('journal-reviewer', ProfileBase::readOnlyHelper(), 'Review the change.');

        $this->journal->savedProfileDraft($draft, new ScriptSource('first'))->savedProfileDraft(
            $draft,
            new ScriptSource('second'),
        );
        $this->journal->activatedProfile(TestProposals::of($reviewer))->assertProfileActive($reviewer->key);

        $this->assertSame(2, $this->journal->profileDraftOf($draft)->revision);
        $this->assertSame('second', $this->journal->profileDraftOf($draft)->currentRevision?->script_source->text);
        $this->assertSame($reviewer->key->key, $this->journal->profileCalled($reviewer->key)->key);
    }

    public function test_a_setting_changes_through_its_command_and_a_broken_record_fails_its_read(): void
    {
        $core = $this->app->make(SettingRegistry::class)->definition('Core');
        $this->assertInstanceOf(CoreSettings::class, $core);

        $this->journal->setting('Core', $core->displayName, 'Our journal')
            ->setting('Core', $core->displayName, 'Our journal again')
            ->assertSetting($core->displayName, 'Our journal again');

        $this->journal->malformedStoredSetting('Library', '{"settings":"not a list"}');
        $this->assertThrows(
            fn () => SettingsRecord::findSharedRuntimeForOwner('Library')->get()->document,
            SettingsDocumentInvalid::class,
        );
    }
}
