<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Tests\Architecture\Support\DomainFiles;

final class PageBuilderPlaceTest extends TestCase
{
    public function test_surface_builders_and_section_readers_live_in_their_http_folders(): void
    {
        $roles = [
            'PageBuilder' => '/Http/Pages/',
            'WindowBuilder' => '/Http/Windows/',
            'SectionResolver' => '/Http/',
        ];

        $outside = [];

        foreach (DomainFiles::in([app_path(), ...DomainFiles::domainCode()]) as $file) {
            $relative = str_replace(base_path().'/', '', $file);
            $source = (string) file_get_contents($file);

            $builderRoles = 0;

            foreach ($roles as $contract => $folder) {
                if (! self::declaresRole($source, $contract)) {
                    continue;
                }

                if (! str_contains($relative, $folder)) {
                    $outside[] = "{$relative} implements {$contract} outside {$folder}";
                }

                if ($contract === 'SectionResolver') {
                    continue;
                }

                $builderRoles++;

                if (! self::declaresConcreteBuild($source)) {
                    $outside[] = "{$relative} must declare its concrete build result";
                }
            }

            if ($builderRoles > 1) {
                $outside[] = "{$relative} implements both surface builder contracts";
            }
        }

        $this->assertSame([], $outside);
    }

    public function test_only_the_declared_surface_and_section_contracts_count(): void
    {
        $this->assertTrue(self::declaresRole('final class HomePageBuilder implements PageBuilder {}', 'PageBuilder'));
        $this->assertTrue(self::declaresRole('final class FileWindowBuilder implements WindowBuilder {}', 'WindowBuilder'));
        $this->assertTrue(self::declaresRole('final class Notices implements SectionResolver {}', 'SectionResolver'));
        $this->assertFalse(self::declaresRole('final class TaskRecords implements TaskResolver {}', 'PageBuilder'));
    }

    private static function declaresConcreteBuild(string $source): bool
    {
        return preg_match('/\bfunction\s+build\s*\([^)]*\)\s*:\s*(\w+)\s*\{/', $source, $match) === 1
            && $match[1] !== 'Data';
    }

    private static function declaresRole(string $source, string $contract): bool
    {
        return preg_match('/\bclass\s+\w+[^{]*\bimplements\b[^{]*\b'.$contract.'\b/', $source) === 1;
    }
}
