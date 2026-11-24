<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Tests\Architecture\Support\DomainFiles;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A class that builds a page from a page recipe (ListPage, DetailPage, SettingsPage or
 * PublicationPage) is a page, and lives in Http/Pages/<Subject> of Core or of its domain; the recipes themselves live in
 * app/Support/Layout.
 */
#[TimeLimit(seconds: 15, reason: 'It reads every PHP file of the core and the domains.')]
final class PagePlacementTest extends TestCase
{
    private const array RECIPES = ['ListPage', 'DetailPage', 'SettingsPage', 'PublicationPage'];

    public function test_every_class_that_builds_a_page_lives_under_http_pages(): void
    {
        $misplaced = array_values(array_filter(
            DomainFiles::in([app_path(), ...DomainFiles::domainCode()]),
            fn (string $file) => $this->buildsAPage($file)
                && ! str_contains($file, '/Http/Pages/')
                && ! str_contains($file, '/app/Support/Layout/'),
        ));

        $this->assertSame([], array_map(fn (string $file) => str_replace(base_path().'/', '', $file), $misplaced));
    }

    private function buildsAPage(string $file): bool
    {
        $tokens = array_values(array_filter(
            token_get_all((string) file_get_contents($file)),
            fn (array|string $token) => ! is_array($token) || ! in_array($token[0], [T_WHITESPACE, T_COMMENT, T_DOC_COMMENT], true),
        ));

        foreach ($tokens as $index => $token) {
            $isName = is_array($token) && in_array($token[0], [T_STRING, T_NAME_QUALIFIED, T_NAME_FULLY_QUALIFIED], true);
            $isRecipe = $isName && in_array(class_basename($token[1]), self::RECIPES, true);
            $next = $tokens[$index + 1] ?? null;
            $call = $tokens[$index + 2] ?? null;

            if ($isRecipe && is_array($next) && $next[0] === T_DOUBLE_COLON && is_array($call) && $call[1] !== 'class') {
                return true;
            }
        }

        return false;
    }
}
