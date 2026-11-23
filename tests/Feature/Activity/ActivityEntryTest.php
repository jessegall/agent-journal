<?php

declare(strict_types=1);

namespace Tests\Feature\Activity;

use App\Enums\ActivityLevel;
use App\Enums\ActivityType;
use App\Enums\ActorType;
use App\Models\ActivityEntry;
use App\Support\ActivityEntryPruning;
use App\Support\ActorIdentity;
use Carbon\CarbonImmutable;
use Tests\Support\CommitsHookRows;
use Tests\TestCase;

/**
 * What agents did is kept as one bounded entry each, read newest first a page at a time, and pruned per environment
 * beyond the kept count.
 */
final class ActivityEntryTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['activity_entries'];

    private const string ENVIRONMENT = 'environment-one';

    public function test_an_entry_of_each_type_takes_its_level_and_cuts_its_subject_and_findings(): void
    {
        foreach (ActivityType::cases() as $type) {
            $entry = ActivityEntry::create($this->agent(), $type, 'src/main.go', self::ENVIRONMENT);

            $this->assertSame($type->defaultLevel(), $entry->level);
        }

        $long = ActivityEntry::create(
            $this->agent(),
            ActivityType::Ran,
            str_repeat('x', ActivityEntry::SUBJECT_CHARACTER_LIMIT + 50),
            self::ENVIRONMENT,
            array_fill(0, ActivityEntry::FOUND_COUNT_LIMIT + 2, str_repeat('y', ActivityEntry::FOUND_CHARACTER_LIMIT + 9)),
        );

        $this->assertSame(ActivityEntry::SUBJECT_CHARACTER_LIMIT, mb_strlen($long->subject));
        $this->assertCount(ActivityEntry::FOUND_COUNT_LIMIT, $long->found ?? []);
        $this->assertSame(ActivityEntry::FOUND_CHARACTER_LIMIT, mb_strlen(($long->found ?? [''])[0]));
        $this->assertSame(ActivityLevel::Chat, ActivityType::Posted->defaultLevel());
    }

    public function test_entries_are_read_newest_first_from_a_cursor_and_new_ones_past_an_id(): void
    {
        $entries = [];

        foreach (['first', 'second', 'third'] as $minutes => $subject) {
            CarbonImmutable::setTestNow(CarbonImmutable::parse('2026-11-23 09:00')->addMinutes($minutes));
            $entries[] = ActivityEntry::create($this->agent(), ActivityType::Read, $subject, self::ENVIRONMENT);
        }

        ActivityEntry::create($this->agent(), ActivityType::Read, 'elsewhere', 'environment-two');

        $this->assertSame(
            ['third', 'second', 'first'],
            ActivityEntry::query()->newestBefore(self::ENVIRONMENT, null)->pluck('subject')->all(),
        );
        $this->assertSame(
            ['first'],
            ActivityEntry::query()->newestBefore(self::ENVIRONMENT, $entries[1])->pluck('subject')->all(),
        );
        $this->assertSame(
            ['second', 'third'],
            ActivityEntry::query()->after(self::ENVIRONMENT, $entries[0]->id)->pluck('subject')->all(),
        );
    }

    public function test_only_the_newest_entries_of_each_environment_are_kept(): void
    {
        for ($count = 0; $count <= ActivityEntry::KEPT_ENTRY_LIMIT; $count++) {
            ActivityEntry::create($this->agent(), ActivityType::Read, "file {$count}", self::ENVIRONMENT);
        }

        ActivityEntry::create($this->agent(), ActivityType::Read, 'kept', 'environment-two');

        $this->app->make(ActivityEntryPruning::class)->prune();

        $this->assertSame(ActivityEntry::KEPT_ENTRY_LIMIT, ActivityEntry::query()->where('environment_id', self::ENVIRONMENT)->count());
        $this->assertFalse(ActivityEntry::query()->where('subject', 'file 0')->exists());
        $this->assertTrue(ActivityEntry::query()->where('subject', 'kept')->exists());
    }

    private function agent(): ActorIdentity
    {
        return new ActorIdentity(ActorType::Agent, '01jqzr00000000000000000agent');
    }
}
