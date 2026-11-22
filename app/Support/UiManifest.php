<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Files\Files;
use App\Declarations\RegisteredPage;
use App\Exceptions\UiManifestInvalid;
use App\Support\Types\PagePropTypes;
use App\Values\FilePath;
use Illuminate\Contracts\View\Factory;
use Throwable;

/**
 * Writes the browser build's view of the installed domains from the checked declarations: the component map, the
 * TypeScript include list and paths, the Vite aliases, the Tailwind sources and the server's component map. All five
 * are rendered and checked first and then replaced together under one content hash, so a failure leaves the previous
 * build whole. It reads no actor and no request.
 */
final readonly class UiManifest
{
    /**
     * The TypeScript files outside the domains, kept in the generated include list.
     */
    private const array SHARED_INCLUDES = [
        'resources/js/**/*.ts',
        'resources/js/**/*.d.ts',
        'resources/js/**/*.tsx',
        'resources/js/**/*.vue',
    ];

    public function __construct(
        private UiDeclarations $declarations,
        private Factory $views,
        private PagePropTypes $propTypes,
        private Files $files,
    ) {}

    /**
     * Writes every artifact under the project root and answers with their shared hash.
     */
    public function write(string $projectRoot): string
    {
        $base = $this->files->filePathOf($projectRoot);
        $root = $this->files->realPath($base);
        $components = $this->components($base, $root);
        $folders = $this->domainFolders($root);
        $hash = substr(sha1((string) json_encode([$components, $folders])), 0, 12);

        $artifacts = [
            'resources/js/generated/ui-manifest.ts' => $this->render('ui-manifest.ts', [
                'hash' => $hash,
                'components' => array_map(fn (string $path) => '../../../'.$path, $components),
                'declaredPages' => array_map(
                    fn (RegisteredPage $page) => $page->componentName(),
                    $this->declarations->pages(),
                ),
            ]),
            'tsconfig.domains.json' => $this->typeScriptConfig($hash, $folders),
            'vite.domains.ts' => $this->render('vite.domains.ts', [
                'hash' => $hash,
                'aliases' => $this->aliases($folders),
                'vendorRoots' => array_values(
                    array_filter($folders, fn (string $path) => str_starts_with($path, 'vendor/')),
                ),
            ]),
            'resources/css/generated/domain-sources.css' => $this->render('domain-sources.css', [
                'hash' => $hash,
                'sources' => array_map(
                    fn (string $path) => '../../../'.$path,
                    array_values($folders),
                ),
            ]),
            'resources/js/generated/types/page-props.ts' => $this->render('page-props.ts', [
                'hash' => $hash,
                'imports' => $this->propTypes->imports(),
                'pages' => $this->propTypes->pageProps(),
                'windows' => $this->propTypes->windowProps(),
            ]),
            'resources/js/generated/ui-prop-checks.ts' => $this->render(
                'ui-prop-checks.ts',
                [
                    'hash' => $hash,
                    'checks' => $this->propChecks($root),
                    'dataTypes' => array_values(
                        array_unique(array_map($this->propTypes->dataTypeOf(...), $this->declarations->pages())),
                    ),
                ],
            ),
            'resources/js/generated/domain-roots.json' => json_encode(
                ['hash' => $hash, 'owners' => $folders],
                JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR,
            )."\n",
            'bootstrap/cache/ui-components.php' => <<<'TEXT'
            <?php

            return 
            TEXT.var_export($components, true).";\n",
        ];

        foreach ($artifacts as $path => $content) {
            if (trim($content) === ''
                || ! str_contains($content, $hash)
                && $path !== 'bootstrap/cache/ui-components.php') {
                throw UiManifestInvalid::emptyOrUnmarked($path);
            }
        }

        $this->replaceTogether($base, $artifacts, $hash);

        return $hash;
    }

    /**
     * Every component by its unique name, as a path from the project root: today's pages under resources/js/pages by
     * their file name, and each declared page and section by its domain and path.
     *
     * @return array<string, string>
     */
    private function components(FilePath $base, string $root): array
    {
        $components = [];

        foreach ($this->files->matching($base->child('resources/js/pages/*.vue')) as $page) {
            $components[basename($page->name(), '.vue')] = $this->fromRoot($root, $page->fingerprint->realPath);
        }

        foreach ($this->declarations->pages() as $page) {
            $components[$page->componentName()] = $this->fromRoot($root, $page->componentFile);
        }

        foreach ($this->declarations->sections() as $section) {
            $components[$section->componentName()] = $this->fromRoot($root, $section->componentFile);
        }

        foreach ($this->declarations->nativeParts() as $name => $file) {
            $components[$name] = $this->fromRoot($root, $file);
        }

        ksort($components);

        return $components;
    }

    /**
     * One check per page component: the props its page gives it, and the component file.
     *
     * @return array<string, array{type: string, path: string}>
     */
    private function propChecks(string $root): array
    {
        $checks = [];

        foreach ($this->declarations->pages() as $page) {
            $checks['accepts_'.str_replace(['.', '-'], '_', $page->key)] = [
                'type' => '{ data: '.$this->propTypes->dataTypeOf($page).' }',
                'path' => '../../../'.$this->fromRoot($root, $page->componentFile),
            ];
        }

        ksort($checks);

        return $checks;
    }

    /**
     * Each domain's component folder that exists, by domain key, as a path from the project root.
     *
     * @return array<string, string>
     */
    private function domainFolders(string $root): array
    {
        $folders = [];

        foreach ($this->declarations->owners() as $owner) {
            $scripts = $this->files->filePathOf($owner->scriptFolder);

            if ($this->files->isFolder($scripts)) {
                $folders[$owner->key] = $this->fromRoot($root, $this->files->realPath($scripts));
            }
        }

        ksort($folders);

        return $folders;
    }

    /**
     * @param  array<string, string>  $folders
     * @return array<string, string>
     */
    private function aliases(array $folders): array
    {
        $aliases = [
            '@kit' => 'resources/js/kit',
            '@generated/types' => 'resources/js/generated/types',
            '@generated/routes' => 'resources/js/routes',
        ];

        foreach ($folders as $key => $path) {
            $aliases["@domain/{$key}"] = $path;
        }

        return $aliases;
    }

    /**
     * @param  array<string, string>  $folders
     */
    private function typeScriptConfig(string $hash, array $folders): string
    {
        $paths = [
            '@/*' => ['./resources/js/*'],
            '@kit/*' => ['./resources/js/kit/*'],
            '@generated/types/*' => ['./resources/js/generated/types/*'],
            '@generated/routes/*' => ['./resources/js/routes/*'],
        ];

        $include = self::SHARED_INCLUDES;

        foreach ($folders as $key => $path) {
            $paths["@domain/{$key}/*"] = ["./{$path}/*"];
            array_push($include, "{$path}/**/*.ts", "{$path}/**/*.vue");
        }

        $config = [
            '//' => "Generated by php artisan journal:ui-manifest from the installed domains ({$hash}); do not edit.",
            'compilerOptions' => ['paths' => $paths],
            'include' => $include,
        ];

        return json_encode($config, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR)."\n";
    }

    /**
     * @param  array<string, mixed>  $templateFields
     */
    private function render(string $template, array $templateFields): string
    {
        return $this->views->file(dirname(__DIR__, 2)."/resources/views/generators/{$template}.blade.php", $templateFields)->render();
    }

    /**
     * Writes each artifact beside its target first, then, one generation at a time under the manifest's lock, moves
     * them all into place; a move that fails puts every file it replaced back, so the build reads one whole generation.
     *
     * @param  array<string, string>  $artifacts
     */
    private function replaceTogether(FilePath $base, array $artifacts, string $hash): void
    {
        $lock = $base->child('bootstrap/cache/ui-manifest.lock');

        $this->files->locked($lock, function () use ($base, $artifacts, $hash): void {
            foreach ($artifacts as $path => $content) {
                $this->files->write($base->child("{$path}.{$hash}.tmp"), $content);
            }

            $replaced = [];

            try {
                foreach (array_keys($artifacts) as $path) {
                    $this->keepPrevious($base, $path, $hash);
                    $replaced[] = $path;
                    $this->files->move($base->child("{$path}.{$hash}.tmp"), $base->child($path));
                }
            } catch (Throwable $failure) {
                $this->restorePrevious($base, $replaced, array_keys($artifacts), $hash);

                throw $failure;
            }

            foreach ($replaced as $path) {
                $this->forgetPrevious($base, $path, $hash);
            }
        });
    }

    private function keepPrevious(FilePath $base, string $path, string $hash): void
    {
        if ($this->files->exists($base->child($path))) {
            $this->files->move($base->child($path), $base->child("{$path}.{$hash}.previous"));
        }
    }

    /**
     * Puts back each file a failed generation had already moved aside, and leaves none of its staged files behind.
     *
     * @param  list<string>  $replaced
     * @param  list<string>  $paths
     */
    private function restorePrevious(FilePath $base, array $replaced, array $paths, string $hash): void
    {
        foreach ($replaced as $path) {
            if ($this->files->exists($base->child("{$path}.{$hash}.previous"))) {
                $this->files->move($base->child("{$path}.{$hash}.previous"), $base->child($path));
            }
        }

        foreach ($paths as $path) {
            if ($this->files->exists($base->child("{$path}.{$hash}.tmp"))) {
                $this->files->delete($base->child("{$path}.{$hash}.tmp"));
            }
        }
    }

    private function forgetPrevious(FilePath $base, string $path, string $hash): void
    {
        if ($this->files->exists($base->child("{$path}.{$hash}.previous"))) {
            $this->files->delete($base->child("{$path}.{$hash}.previous"));
        }
    }

    /**
     * A file's path from the project root, both real paths, climbing out of the root with .. when the file lies
     * outside it.
     */
    private function fromRoot(string $root, string $file): string
    {
        $from = explode('/', trim($root, '/'));
        $to = explode('/', trim($file, '/'));
        $shared = 0;

        while ($shared < count($from) && $shared < count($to) && $from[$shared] === $to[$shared]) {
            $shared++;
        }

        return implode('/', [...array_fill(0, count($from) - $shared, '..'), ...array_slice($to, $shared)]);
    }
}
