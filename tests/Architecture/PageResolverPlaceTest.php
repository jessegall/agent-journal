<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Tests\Architecture\Support\DomainFiles;

/**
 * What serves the frontend lives in Http: a page or section resolver of Core or of a domain sits under its Http folder,
 * never in the plain Resolvers folder beside the record resolvers.
 */
final class PageResolverPlaceTest extends TestCase
{
    private const string UI_RESOLVER = '/\bclass\s+\w+[^{]*\bimplements\b[^{]*\b(?:PageResolver|SectionResolver)\b/';

    public function test_every_page_and_section_resolver_lives_under_http(): void
    {
        $outside = [];

        foreach (DomainFiles::in([app_path(), ...glob(base_path('domain/*/src')) ?: []]) as $file) {
            $relative = str_replace(base_path().'/', '', $file);

            if (! str_contains($relative, '/Http/') && self::declaresUiResolver((string) file_get_contents($file))) {
                $outside[] = $relative;
            }
        }

        $this->assertSame([], $outside);
    }

    public function test_a_page_resolver_declaration_is_recognised(): void
    {
        $this->assertSame(
            [true, false],
            [
                self::declaresUiResolver('final readonly class HomeWindowResolver implements PageResolver {}'),
                self::declaresUiResolver('final readonly class TaskRecords implements TaskResolver {}'),
            ],
        );
    }

    private static function declaresUiResolver(string $source): bool
    {
        return preg_match(self::UI_RESOLVER, $source) === 1;
    }
}
