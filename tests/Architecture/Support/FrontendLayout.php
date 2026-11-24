<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use Symfony\Component\Finder\Finder;

/**
 * Where each Vue file of a script root sits and who imports it. A root is the shell's resources/js or an owner's
 * script folder; in each, a shared component sits in components/<component>/, a page's components in pages/<page>/,
 * and a component only that page uses in pages/<page>/partials/. The kit is the shared library and stays shared.
 */
final readonly class FrontendLayout
{
    private const string SHELL = 'resources/js';

    private const string KIT = 'resources/js/components/kit/';

    private const string IMPORT = '/(?:\bfrom\s+|\bimport\s*\(\s*|\bimport\s+)([\'"])([^\'"\n]+)\1/';

    /**
     * @param  list<string>  $roots  every owner's script folder, as a path from the project root
     * @param  array<string, string>  $aliases  each import alias with the folder it stands for
     */
    public function __construct(
        private string $project,
        private array $roots,
        private array $aliases,
        private string $shell = self::SHELL,
    ) {}

    /**
     * The project's layout, its owners read from the roots file the UI manifest writes.
     */
    public static function ofProject(string $project): self
    {
        /** @var array{owners: array<string, string>} $written */
        $written = json_decode(
            (string) file_get_contents($project.'/resources/js/generated/domain-roots.json'),
            true,
            flags: JSON_THROW_ON_ERROR,
        );
        $aliases = ['@/' => self::SHELL.'/', '@kit/' => self::SHELL.'/kit/'];

        foreach ($written['owners'] as $key => $folder) {
            $aliases["@domain/{$key}/"] = $folder.'/';
        }

        return new self($project, array_values($written['owners']), $aliases);
    }

    /**
     * Every fault of the layout: a Vue file out of place, a partial imported from outside its page, and a shared
     * component that one page alone imports. A test may import any component it tests.
     *
     * @return list<string>
     */
    public function faults(): array
    {
        $files = $this->files();
        $importers = $this->importersOf($files);
        $faults = [];

        foreach ($files as $file) {
            if (! str_ends_with($file, '.vue')) {
                continue;
            }

            $place = $this->placeOf($file);

            if (preg_match('#^(components/[^/]+|pages/[^/]+(/partials)?)/[^/]+\.vue$#', $place) !== 1) {
                $faults[] = "{$file} is outside components/<component>/, pages/<page>/ and pages/<page>/partials/";

                continue;
            }

            array_push($faults, ...$this->importFaults($file, $place, $importers[$file] ?? []));
        }

        return $faults;
    }

    /**
     * @param  list<string>  $importers
     * @return list<string>
     */
    private function importFaults(string $file, string $place, array $importers): array
    {
        $isPartial = preg_match('#^pages/[^/]+/partials/#', $place) === 1;
        $isShared = str_starts_with($place, 'components/') && ! str_starts_with($file, self::KIT);
        $codeImporters = array_filter($importers, fn (string $importer) => ! str_ends_with($importer, '.test.ts'));

        if ($isPartial) {
            $page = $this->rootOf($file).'/'.dirname($place, 2).'/';

            return array_values(array_map(
                fn (string $importer) => "{$importer} imports the partial {$file} of another page",
                array_filter($codeImporters, fn (string $importer) => ! str_starts_with($importer, $page)),
            ));
        }

        $pages = array_unique(array_map(fn (string $importer) => $this->pageOf($importer), $codeImporters));
        $isUsedByOnePage = $isShared && count($pages) === 1 && current($pages) !== null;

        return $isUsedByOnePage ? ["{$file} is used by ".current($pages).' alone: make it a partial of that page'] : [];
    }

    /**
     * The page folder a file sits in, pages/<page>/ of its root; null outside every page.
     */
    private function pageOf(string $file): string|null
    {
        $matched = preg_match('#^pages/[^/]+/#', $this->placeOf($file), $page);

        return $matched === 1 ? $this->rootOf($file).'/'.$page[0] : null;
    }

    /**
     * The file's path inside its root.
     */
    private function placeOf(string $file): string
    {
        return substr($file, strlen($this->rootOf($file)) + 1);
    }

    /**
     * The owner's script folder the file sits in, the longest that holds it, or the shell's root.
     */
    private function rootOf(string $file): string
    {
        $holding = array_filter($this->roots, fn (string $root) => str_starts_with($file, $root.'/'));
        usort($holding, fn (string $one, string $other) => strlen($other) <=> strlen($one));

        return $holding[0] ?? $this->shell;
    }

    /**
     * Every script file of the shell and of each root, generated code left out, as paths from the project root.
     *
     * @return list<string>
     */
    private function files(): array
    {
        $folders = array_unique([$this->shell, ...$this->roots]);
        $files = [];

        foreach ($folders as $folder) {
            $finder = Finder::create()->files()->in($this->project.'/'.$folder)->name(['*.vue', '*.ts'])
                ->exclude(['generated', 'actions', 'routes', 'wayfinder']);

            foreach ($finder as $file) {
                $files[] = $folder.'/'.str_replace('\\', '/', $file->getRelativePathname());
            }
        }

        return array_values(array_unique($files));
    }

    /**
     * Each imported file with the files that import it.
     *
     * @param  list<string>  $files
     * @return array<string, list<string>>
     */
    private function importersOf(array $files): array
    {
        $importers = [];

        foreach ($files as $file) {
            preg_match_all(self::IMPORT, (string) file_get_contents($this->project.'/'.$file), $found);

            foreach ($found[2] as $specifier) {
                $target = $this->resolved($file, $specifier);

                if ($target !== null) {
                    $importers[$target][] = $file;
                }
            }
        }

        return $importers;
    }

    /**
     * The file an import names, through a relative path or an alias; null for a package or a missing file.
     */
    private function resolved(string $file, string $specifier): string|null
    {
        $base = str_starts_with($specifier, '.') ? self::joined(dirname($file), $specifier) : $this->unaliased($specifier);

        foreach ($base === null ? [] : [$base, "{$base}.ts", "{$base}.vue", "{$base}/index.ts"] as $candidate) {
            if (is_file($this->project.'/'.$candidate)) {
                return $candidate;
            }
        }

        return null;
    }

    private function unaliased(string $specifier): string|null
    {
        $aliases = array_keys($this->aliases);
        usort($aliases, fn (string $one, string $other) => strlen($other) <=> strlen($one));

        foreach ($aliases as $alias) {
            if (str_starts_with($specifier, $alias)) {
                return $this->aliases[$alias].substr($specifier, strlen($alias));
            }
        }

        return null;
    }

    /**
     * A relative path joined to a folder, with its . and .. parts worked out.
     */
    private static function joined(string $folder, string $relative): string
    {
        $parts = [];

        foreach (explode('/', $folder.'/'.$relative) as $part) {
            match ($part) {
                '', '.' => null,
                '..' => array_pop($parts),
                default => $parts[] = $part,
            };
        }

        return implode('/', $parts);
    }
}
