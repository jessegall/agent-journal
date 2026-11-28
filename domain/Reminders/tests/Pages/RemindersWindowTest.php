<?php

declare(strict_types=1);

namespace Domain\Reminders\Tests\Pages;

use Domain\Reminders\Http\Pages\Resolvers\RemindersWindowResolver;
use Domain\Reminders\Tests\TestCase;
use Tests\Support\RefreshHookDatabase;

/**
 * The reminders window of an owner with no reminder shows the designed empty state: the bell on its tile, No reminders
 * yet and the sentence on what a reminder is for.
 */
final class RemindersWindowTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_window_with_no_reminder_shows_the_empty_state_with_the_bell(): void
    {
        $this->journal->owner();

        $window = $this->app->make(RemindersWindowResolver::class)->read()->root;
        $empty = $window->children[1];

        $this->assertSame(['title', 'empty-page'], array_map(fn ($part) => $part->key, $window->children));
        $this->assertSame('page-empty', $empty->style);
        $this->assertSame('bell', $empty->children[0]->text);
        $this->assertSame('No reminders yet', $empty->children[1]->text);
        $this->assertSame(
            'A reminder brings something back to you or an agent at the time you choose.',
            $empty->children[1]->detail,
        );
    }
}
