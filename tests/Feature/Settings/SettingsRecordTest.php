<?php

declare(strict_types=1);

namespace Tests\Feature\Settings;

use App\Settings\Casts\SettingsDocumentCast;
use App\Settings\Exceptions\SettingsDocumentInvalid;
use App\Settings\Models\SettingsRecord;
use App\Settings\Storage\SettingsDocument;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The settings_records table and its structural document: entries are kept exactly as stored whatever their values,
 * changing one entry keeps every other byte for byte, and a document broken as a whole is refused by name.
 */
final class SettingsRecordTest extends TestCase
{
    use RefreshHookDatabase;

    private const string STORED = '{"settings":[{"key":"retry_limit","value":4},{"key":"display_name","value":[1,2]},{"key":"retired_key","value":{"note":"ünïcode/slash","empty":{},"decimal":1.5}},{"key":"cleared","value":null}],"toggles":[{"key":"review","value":true}]}';

    public function test_the_migration_creates_the_table(): void
    {
        $this->assertTrue(
            Schema::hasColumns('settings_records', ['id', 'owner', 'revision', 'document', 'created_at', 'updated_at']),
        );
    }

    public function test_an_absent_owner_has_no_record_and_insert_if_absent_makes_one_empty_record_once(): void
    {
        $this->assertTrue(SettingsRecord::sharedRuntimeForOwner('Library')->isEmpty());

        SettingsRecord::insertIfAbsent('Library');
        SettingsRecord::insertIfAbsent('Library');

        $record = SettingsRecord::sharedRuntimeForOwner('Library')->get();
        $this->assertSame(1, SettingsRecord::query()->where('owner', 'Library')->count());
        $this->assertSame(0, $record->revision);
        $this->assertSame('{"settings":[],"toggles":[]}', $record->document->toJson());
        $this->assertSame($record->id, SettingsRecord::lockedForOwner('Library')->id);
    }

    public function test_a_document_with_valid_invalid_and_unknown_entries_round_trips_unchanged(): void
    {
        $this->store(self::STORED);

        $record = SettingsRecord::lockedForOwner('Library');
        $record->revise($record->document);

        $this->assertSame(self::STORED, $this->storedText());
        $this->assertSame(1, SettingsRecord::lockedForOwner('Library')->revision);
    }

    public function test_removing_or_replacing_one_entry_keeps_every_other_entry_byte_for_byte(): void
    {
        $this->store(self::STORED);
        $record = SettingsRecord::lockedForOwner('Library');
        $retryLimit = $record->document->setting('retry_limit')->get();

        $record->revise($record->document->withoutSetting('retry_limit')->withoutToggle('review'));

        $this->assertSame(
            '{"settings":[{"key":"display_name","value":[1,2]},{"key":"retired_key","value":{"note":"ünïcode/slash","empty":{},"decimal":1.5}},{"key":"cleared","value":null}],"toggles":[]}',
            $this->storedText(),
        );
        $this->assertSame(1, SettingsRecord::lockedForOwner('Library')->revision);

        $record = SettingsRecord::lockedForOwner('Library');
        $record->revise($record->document->withSetting($retryLimit));

        $this->assertSame(
            '{"settings":[{"key":"display_name","value":[1,2]},{"key":"retired_key","value":{"note":"ünïcode/slash","empty":{},"decimal":1.5}},{"key":"cleared","value":null},{"key":"retry_limit","value":4}],"toggles":[]}',
            $this->storedText(),
        );
        $this->assertSame(2, SettingsRecord::lockedForOwner('Library')->revision);
        $this->assertTrue($record->document->setting('retired_key')->isDefined());
        $this->assertTrue($record->document->setting('missing')->isEmpty());
    }

    /**
     * @return array<string, array{string}>
     */
    public static function brokenDocuments(): array
    {
        return [
            'missing toggles list' => ['{"settings":[{"key":"secret_value","value":1}]}'],
            'toggles not a list' => ['{"settings":[],"toggles":{"key":"secret_value"}}'],
            'extra envelope field' => ['{"settings":[],"toggles":[],"secret_value":1}'],
            'duplicate key' => ['{"settings":[{"key":"secret_value","value":1},{"key":"secret_value","value":2}],"toggles":[]}'],
            'invalid key' => ['{"settings":[{"key":"Secret Value","value":1}],"toggles":[]}'],
            'entry without value' => ['{"settings":[],"toggles":[{"key":"secret_value"}]}'],
            'entry with an extra field' => ['{"settings":[{"key":"secret_value","value":1,"more":2}],"toggles":[]}'],
            'over 512 KiB' => [
                '{"settings":[{"key":"secret_value","value":"'.str_repeat('x', SettingsDocument::MOST_BYTES).'"}],"toggles":[]}',
            ],
        ];
    }

    #[DataProvider('brokenDocuments')]
    public function test_a_document_broken_as_a_whole_is_refused_without_its_content(string $document): void
    {
        $this->store($document);
        $record = SettingsRecord::lockedForOwner('Library');

        try {
            $record->document;
            $this->fail('A broken document was read.');
        } catch (SettingsDocumentInvalid $invalid) {
            $this->assertStringContainsString('Library', $invalid->getMessage());
            $this->assertStringNotContainsString('secret_value', $invalid->getMessage());
        }
    }

    public function test_text_that_is_not_json_is_refused_by_the_cast_without_its_content(): void
    {
        try {
            new SettingsDocumentCast()->get(
                new SettingsRecord(),
                'document',
                '{"settings":[{"key":"secret_value"',
                ['owner' => 'Library'],
            );
            $this->fail('Text that is not JSON was read.');
        } catch (SettingsDocumentInvalid $invalid) {
            $this->assertSame(SettingsDocumentInvalid::notJson('Library')->getMessage(), $invalid->getMessage());
        }
    }

    private function store(string $document): void
    {
        SettingsRecord::insertIfAbsent('Library');
        DB::table('settings_records')->where('owner', 'Library')->update(['document' => $document]);
    }

    private function storedText(): string
    {
        return (string) DB::table('settings_records')->where('owner', 'Library')->value('document');
    }
}
