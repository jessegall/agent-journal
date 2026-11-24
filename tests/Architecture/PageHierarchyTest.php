<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Http\Pages\Page;
use App\Support\Reflector;
use Tests\TestCase;

/**
 * Every page class under a subject folder of Http/Pages extends that subject's page, named after the folder, and
 * every subject's page extends the one base Page, so what pages share is written once.
 */
final class PageHierarchyTest extends TestCase
{
    public function test_every_page_extends_its_subjects_page_and_every_subject_page_extends_page(): void
    {
        $faults = [];

        foreach ($this->subjectFolders() as $folder) {
            $subject = basename($folder).'Page';

            foreach (glob("{$folder}/*.php") ?: [] as $file) {
                $namespace = $this->namespaceOf($file);
                $class = $namespace.'\\'.basename($file, '.php');
                $expected = basename($file, '.php') === $subject ? Page::class : "{$namespace}\\{$subject}";

                if (! Reflector::exists($class)) {
                    $faults[] = "{$file} declares no class {$class}";

                    continue;
                }

                $parent = Reflector::of($class)->parent();

                if (! $parent->isDefined() || $parent->get()->name() !== $expected) {
                    $faults[] = "{$class} does not extend {$expected}";
                }
            }
        }

        $this->assertSame([], $faults);
    }

    /**
     * The subject folders of Core's and every domain's Http/Pages, without the resolvers.
     *
     * @return list<string>
     */
    private function subjectFolders(): array
    {
        $folders = [
            ...glob(app_path('Http/Pages/*'), GLOB_ONLYDIR) ?: [],
            ...glob(base_path('domain/*/src/Http/Pages/*'), GLOB_ONLYDIR) ?: [],
        ];

        return array_values(array_filter($folders, fn (string $folder) => basename($folder) !== 'Resolvers'));
    }

    private function namespaceOf(string $file): string
    {
        preg_match('/^namespace\s+([^;]+);/m', (string) file_get_contents($file), $found);

        return $found[1] ?? $this->fail("{$file} declares no namespace.");
    }
}
