<?php

declare(strict_types=1);

namespace Tests\Feature\Reminders;

use App\Contracts\Bus\CommandBus;
use App\Models\Access\User;
use App\Support\Access\AccessSettings;
use Carbon\CarbonImmutable;
use Domain\Reminders\Commands\CreateReminder\CreateReminderCommand;
use Domain\Reminders\Commands\FinishReminder\FinishReminderCommand;
use Domain\Reminders\Enums\ReminderStatus;
use Domain\Reminders\Exceptions\ReminderEnded;
use Domain\Reminders\Models\Reminder;
use Domain\Reminders\Resolvers\Support\OwnReminders;
use Domain\Reminders\Values\ReminderCard;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

/**
 * A reminder is made and finished through its commands, read back as the owner's own page with open ones first by due
 * time, and listed by the Reminders window, which says No reminders when there are none.
 */
final class RemindersTest extends TestCase
{
    use RefreshHookDatabase;
    use StartsAgentRequests;

    private const string TITLE = 'Read the review';

    private User $owner;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
    }

    public function test_reminders_are_read_open_first_by_due_time_and_a_finished_one_is_done(): void
    {
        $later = $this->create('Ship the release', CarbonImmutable::parse('2026-12-02 09:00'));
        $sooner = $this->create('Read the review', CarbonImmutable::parse('2026-12-01 09:00'));
        $done = $this->create('Book the room', CarbonImmutable::parse('2026-11-30 09:00'));
        $this->app->make(CommandBus::class)->run(new FinishReminderCommand($done));

        $page = $this->app->make(OwnReminders::class)->own(1);

        $this->assertSame([$sooner, $later, $done], array_map(fn (ReminderCard $card) => $card->id, $page->cards));
        $this->assertSame(3, $page->total);
        $this->assertSame(ReminderStatus::Done, Reminder::query()->findOrFail($done)->status);
    }

    public function test_a_finished_reminder_cannot_be_finished_again(): void
    {
        $id = $this->create('Book the room', CarbonImmutable::parse('2026-11-30 09:00'));
        $bus = $this->app->make(CommandBus::class);
        $bus->run(new FinishReminderCommand($id));

        $this->expectException(ReminderEnded::class);

        $bus->run(new FinishReminderCommand($id));
    }

    public function test_the_window_lists_reminders_and_says_when_there_are_none(): void
    {
        $empty = $this->pageOf('/reminders');
        $this->create(self::TITLE, CarbonImmutable::parse('2026-12-01 09:00'));
        $listed = $this->pageOf('/reminders');

        $this->assertStringContainsString('"key":"empty"', $empty);
        $this->assertStringContainsString(self::TITLE, $listed);
        $this->assertStringContainsString(ReminderStatus::Open->label(), $listed);
    }

    private function create(string $title, CarbonImmutable $dueAt): string
    {
        $this->startUserRequestAs($this->owner->id);

        return $this->app->make(CommandBus::class)->run(new CreateReminderCommand($title, $dueAt->toIso8601String()));
    }

    private function pageOf(string $address): string
    {
        $page = $this->actingAs($this->owner)->get($address)->assertOk()->viewData('page');

        return (string) json_encode($page, JSON_UNESCAPED_SLASHES);
    }
}
