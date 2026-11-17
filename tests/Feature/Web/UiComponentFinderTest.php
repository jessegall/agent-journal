<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Core\Ui\Declarations\Page;
use App\Core\Ui\Enums\Icon;
use App\Core\Ui\Support\UiDeclarations;
use App\Domain\DomainEntry;
use InvalidArgumentException;
use Tests\Fixtures\UiDeclarations\Library\BooksReader;
use Tests\Fixtures\UiDeclarations\Library\LibraryDomain;
use Tests\TestCase;

/**
 * Inertia's page check reads the declared components by their domain name and today's pages by their file, and
 * refuses a name it does not know.
 */
final class UiComponentFinderTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->app->instance(UiDeclarations::class, UiDeclarations::check([
            DomainEntry::fromClass(LibraryDomain::class)->declaring(pages: [
                Page::make('index', 'Library', Icon::Docs, BooksReader::class, 'Index.vue')->at(''),
            ]),
        ]));
    }

    public function test_a_declared_component_and_a_page_of_today_are_both_found(): void
    {
        $finder = $this->app->make('inertia.view-finder');

        $this->assertStringEndsWith('Library/Resources/js/Index.vue', $finder->find('library/Index'));
        $this->assertStringEndsWith('resources/js/pages/Login.vue', $finder->find('Login'));
    }

    public function test_an_unknown_component_is_refused(): void
    {
        $this->expectException(InvalidArgumentException::class);

        $this->app->make('inertia.view-finder')->find('nowhere/Missing');
    }
}
