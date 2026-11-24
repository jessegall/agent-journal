<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Declarations\RegisteredNavigation;
use App\Declarations\RegisteredPage;
use App\Support\UiDeclarations;
use Tests\TestCase;

/**
 * Every page of the app is listed in tools/design-compare/pages.json with its comparison views, or with the reason the
 * design draws none, and every view is listed by a page. It never runs a comparison, so a change of the design never
 * fails it.
 */
final class DesignComparisonPagesTest extends TestCase
{
    private const string PAGES = 'tools/design-compare/pages.json';

    private const string VIEWS = 'tools/design-compare/views';

    public function test_every_sidebar_page_is_listed_and_every_listed_page_exists(): void
    {
        $declarations = $this->app->make(UiDeclarations::class);
        $sidebarPages = array_values(array_filter(array_map(
            fn (RegisteredNavigation $item) => $item->page?->key,
            $declarations->navigation(),
        )));
        $declaredPages = array_map(fn (RegisteredPage $page) => $page->key, $declarations->pages());
        $listed = array_keys($this->pages());

        $this->assertSame([], array_values(array_diff($sidebarPages, $listed)));
        $this->assertSame([], array_values(array_diff($listed, $declaredPages)));
    }

    public function test_every_page_names_its_views_or_why_the_design_draws_none(): void
    {
        $empty = array_keys(array_filter(
            $this->pages(),
            fn (array $entry) => ($entry['views'] ?? []) === [] && trim($entry['noDesign'] ?? '') === '',
        ));

        $this->assertSame([], $empty);
    }

    public function test_every_view_is_listed_by_a_page_and_every_listed_view_exists(): void
    {
        $listed = array_merge(...array_values(array_map(fn (array $entry) => $entry['views'] ?? [], $this->pages())));
        $files = array_map(
            fn (string $file) => basename($file, '.json'),
            glob(base_path(self::VIEWS.'/*.json')) ?: [],
        );

        $this->assertSame([], array_values(array_diff($files, $listed)));
        $this->assertSame([], array_values(array_diff($listed, $files)));
    }

    /**
     * @return array<string, array{views?: list<string>, noDesign?: string}>
     */
    private function pages(): array
    {
        return json_decode((string) file_get_contents(base_path(self::PAGES)), true, flags: JSON_THROW_ON_ERROR);
    }
}
