<?php

declare(strict_types=1);

namespace Tests\Unit\Web;

use App\Web\Creation\Exceptions\InvalidBuilder;
use App\Web\Creation\Exceptions\MissingBuilder;
use App\Web\Creation\PageFactory;
use App\Web\Creation\WindowFactory;
use Illuminate\Http\Request;
use Tests\Fixtures\Web\Types\BookData;
use Tests\Fixtures\Web\Types\BookPageBuilder;
use Tests\Fixtures\Web\Types\BookWindowBuilder;
use Tests\Fixtures\Web\Types\ShelfPage;
use Tests\TestCase;

final class WindowFactoryTest extends TestCase
{
    public function test_a_registered_window_builds_its_exact_type(): void
    {
        $factory = new WindowFactory();
        $factory->register(BookData::class, BookWindowBuilder::class);

        $book = $factory->create(BookData::class, Request::create('/book'));

        $this->assertSame(BookData::class, $book::class);
        $this->assertSame('/book', $book->title);
    }

    public function test_a_page_registration_never_supplies_a_window(): void
    {
        $pages = new PageFactory();
        $pages->register(BookData::class, BookPageBuilder::class);
        $windows = new WindowFactory();
        $this->expectExceptionObject(MissingBuilder::forType('window', BookData::class));

        $windows->create(BookData::class, Request::create('/book'));
    }

    public function test_a_duplicate_window_registration_is_refused(): void
    {
        $factory = new WindowFactory();
        $factory->register(BookData::class, BookWindowBuilder::class);
        $this->expectExceptionObject(InvalidBuilder::duplicate('window', BookData::class));

        $factory->register(BookData::class, BookWindowBuilder::class);
    }

    public function test_a_page_builder_cannot_be_registered_as_a_window_builder(): void
    {
        $this->expectExceptionObject(InvalidBuilder::registration('window', BookData::class, BookPageBuilder::class));

        new WindowFactory()->register(BookData::class, BookPageBuilder::class);
    }

    public function test_a_window_builder_cannot_return_a_different_type(): void
    {
        $factory = new WindowFactory();
        $factory->register(ShelfPage::class, BookWindowBuilder::class);
        $this->expectExceptionObject(
            InvalidBuilder::result(BookWindowBuilder::class, BookData::class, ShelfPage::class),
        );

        $factory->create(ShelfPage::class, Request::create('/shelf'));
    }
}
