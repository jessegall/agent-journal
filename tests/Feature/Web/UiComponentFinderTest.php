<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Declarations\Page;
use App\Enums\Icon;
use App\Support\DomainEntry;
use App\Support\UiDeclarations;
use InvalidArgumentException;
use Tests\Fixtures\UiDeclarations\Library\BooksResolver;
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
                Page::make('index', 'Library', Icon::Docs, BooksResolver::class, 'Index.vue')->at(''),
            ]),
        ]));
    }

    public function test_a_declared_component_and_a_page_of_today_are_both_found(): void
    {
        $finder = $this->app->make('inertia.view-finder');

        $this->assertStringEndsWith('Library/Resources/js/pages/library/Index.vue', $finder->find('library/Index'));
        $this->assertStringEndsWith('resources/js/pages/login/Login.vue', $finder->find('Login'));
    }

    public function test_the_page_entry_is_the_component_file_from_the_project_root(): void
    {
        $finder = $this->app->make('inertia.view-finder');

        $this->assertSame('resources/js/pages/login/Login.vue', $finder->entry('Login'));
        $this->assertStringEndsWith('Library/Resources/js/pages/library/Index.vue', $finder->entry('library/Index'));
        $this->assertStringStartsNotWith('/', $finder->entry('library/Index'));
    }

    public function test_an_unknown_component_is_refused(): void
    {
        $this->expectException(InvalidArgumentException::class);

        $this->app->make('inertia.view-finder')->find('nowhere/Missing');
    }
}
