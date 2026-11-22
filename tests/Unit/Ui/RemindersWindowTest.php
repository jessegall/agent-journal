<?php

declare(strict_types=1);

namespace Tests\Unit\Ui;

use Domain\Reminders\Resolvers\RemindersWindowResolver;
use PHPUnit\Framework\TestCase;

/**
 * Without a reminders read a user may see, the window says reminders are unavailable and shows no list.
 */
final class RemindersWindowTest extends TestCase
{
    public function test_the_window_says_reminders_are_unavailable_instead_of_showing_an_empty_list(): void
    {
        $root = new RemindersWindowResolver()->read()->root;

        $this->assertSame(['title', 'unavailable'], array_map(fn ($part) => $part->key, $root->children));
        $this->assertSame('empty', $root->children[1]->style);
    }
}
