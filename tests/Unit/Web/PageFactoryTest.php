<?php

declare(strict_types=1);

namespace Tests\Unit\Web;

use App\Web\Creation\Contracts\PageBuilder;
use App\Web\Creation\Exceptions\InvalidBuilder;
use App\Web\Creation\Exceptions\MissingBuilder;
use App\Web\Creation\PageFactory;
use Illuminate\Container\Container;
use Illuminate\Http\Request;
use PHPUnit\Framework\Attributes\DataProvider;
use Spatie\LaravelData\Data;
use Tests\Fixtures\Web\Types\BookData;
use Tests\Fixtures\Web\Types\BookPageBuilder;
use Tests\Fixtures\Web\Types\ShelfPage;
use Tests\TestCase;

final class PageFactoryTest extends TestCase
{
    public function test_each_creation_resolves_a_fresh_builder_for_its_visit(): void
    {
        $factory = new PageFactory();
        $factory->register(BookData::class, BookPageBuilder::class);

        $this->assertSame(BookPageBuilder::class, $factory->builderFor(BookData::class));
        $this->assertFalse(Container::getInstance()->resolved(BookPageBuilder::class));

        $first = $factory->create(BookData::class, Request::create('/first'));
        $second = $factory->create(BookData::class, Request::create('/second'));

        $this->assertSame(BookData::class, $first::class);
        $this->assertSame(['/first', '#1'], explode(' ', $first->title));
        $this->assertSame(['/second', '#1'], explode(' ', $second->title));
    }

    public function test_a_builder_is_made_in_the_container_of_the_request_it_serves(): void
    {
        $factory = new PageFactory();
        $factory->register(BookData::class, BookPageBuilder::class);
        $application = Container::getInstance();
        $request = clone $application;
        $request->instance(BookPageBuilder::class, new BookPageBuilder());
        Container::setInstance($request);

        try {
            $factory->create(BookData::class, Request::create('/first'));
            $second = $factory->create(BookData::class, Request::create('/second'));
        } finally {
            Container::setInstance($application);
        }

        $this->assertSame(['/second', '#2'], explode(' ', $second->title));
    }

    public function test_an_unregistered_type_names_the_page_and_requested_class(): void
    {
        $factory = new PageFactory();
        $factory->register(BookData::class, BookPageBuilder::class);
        $this->expectExceptionObject(MissingBuilder::forType('page', ShelfPage::class));

        $factory->create(ShelfPage::class, Request::create('/shelf'));
    }

    public function test_a_duplicate_registration_is_refused(): void
    {
        $factory = new PageFactory();
        $factory->register(BookData::class, BookPageBuilder::class);
        $this->expectExceptionObject(InvalidBuilder::duplicate('page', BookData::class));

        $factory->register(BookData::class, BookPageBuilder::class);
    }

    /** @return array<string, array{string, string}> */
    public static function invalidRegistrations(): array
    {
        return [
            'non-Data type' => [Request::class, BookPageBuilder::class],
            'base Data type' => [Data::class, BookPageBuilder::class],
            'non-builder class' => [BookData::class, BookData::class],
            'builder interface' => [BookData::class, PageBuilder::class],
            'unknown builder' => [BookData::class, 'Tests\\UnknownBuilder'],
        ];
    }

    #[DataProvider('invalidRegistrations')]
    public function test_an_invalid_registration_is_refused(string $type, string $builder): void
    {
        $factory = new PageFactory();
        $this->expectExceptionObject(InvalidBuilder::registration('page', $type, $builder));

        $factory->register($type, $builder);
    }

    public function test_a_different_result_type_is_refused(): void
    {
        $factory = new PageFactory();
        $factory->register(ShelfPage::class, BookPageBuilder::class);
        $this->expectExceptionObject(InvalidBuilder::result(BookPageBuilder::class, BookData::class, ShelfPage::class));

        $factory->create(ShelfPage::class, Request::create('/shelf'));
    }
}
