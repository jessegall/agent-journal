<?php

declare(strict_types=1);

namespace Tests\Fixtures\TestOverlap\Feature;

/**
 * Tests of the overlap fixture: two that rest on the same facts, and one that a command test covers.
 */
final class ShelfTest
{
    public function test_a_stacked_book_is_on_the_shelf(): void
    {
        $this->bus->run(new StackBookCommand('book-1'));
        $shelf = Shelf::query()->sole();

        $this->assertCount(1, $shelf->books);
        $this->assertSame('book-1', $shelf->books[0]->id);
    }

    public function test_a_stacked_book_is_the_only_one(): void
    {
        $this->bus->run(new StackBookCommand('book-2'));
        $shelf = Shelf::query()->sole();

        $this->assertCount(1, $shelf->books);
        $this->assertSame('book-2', $shelf->books[0]->id);
    }

    public function test_a_lent_book_leaves_the_shelf(): void
    {
        $this->bus->run(new LendBookCommand('book-3'));
        $shelf = Shelf::query()->sole();

        $this->assertCount(0, $shelf->books);
        $this->assertTrue($shelf->isEmpty());
    }
}
