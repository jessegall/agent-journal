<?php

declare(strict_types=1);

namespace Tests\Fixtures\TestOverlap\Commands;

/**
 * The command test of the overlap fixture, which holds everything the shelf's lending test rests on.
 */
final class LendBookTest
{
    public function test_lending_takes_the_book_off_the_shelf_and_records_the_loan(): void
    {
        $this->bus->run(new LendBookCommand('book-3'));
        $shelf = Shelf::query()->sole();
        $loan = Loan::query()->sole();

        $this->assertCount(0, $shelf->books);
        $this->assertTrue($shelf->isEmpty());
        $this->assertSame('book-3', $loan->book_id);
    }
}
