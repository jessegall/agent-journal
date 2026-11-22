<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

/**
 * What may sit directly under app and under a package's src (doc 107, Architecture enforcement): the role folders the
 * layout manifests move code into, the named root files, and, until its batch moves it, an old area folder the
 * manifest still lists.
 */
final readonly class LayoutRoots
{
    private const array CORE_ROOT_FILES = ['CoreApi.php', 'CoreCommands.php', 'CorePages.php', 'CoreMcpTools.php'];

    /**
     * @param  list<string>  $roles  the folder names a role may take at a root
     * @param  list<string>  $pending  the root-relative folders a manifest row still to move or regenerate sits in
     */
    private function __construct(private array $roles, private array $pending) {}

    /**
     * Core's roots, read from manifest-core.json.
     */
    public static function core(string $basePath): self
    {
        return self::fromManifest("{$basePath}/tools/refactoring/layout/manifest-core.json", 'app/');
    }

    /**
     * One package's src roots, read from its manifest.
     */
    public static function package(string $basePath, string $name): self
    {
        return self::fromManifest("{$basePath}/tools/refactoring/layout/manifest-{$name}.json", "domain/{$name}/src/");
    }

    /**
     * The folders and files of a root that are neither a role, a pending area nor an allowed root file, each as given.
     *
     * @param  list<string>  $folders  root-relative folder names
     * @param  list<string>  $files  root-relative file names
     * @param  list<string>  $rootFiles  the file names allowed at this root
     * @return list<string>
     */
    public function misplaced(array $folders, array $files, array $rootFiles): array
    {
        return [
            ...array_values(array_filter(
                $folders,
                fn (string $folder) => ! in_array($folder, $this->roles, true) && ! in_array($folder, $this->pending, true),
            )),
            ...array_values(array_diff($files, $rootFiles)),
        ];
    }

    /**
     * Whether the folder is an old area that still waits for its move, whose own root holds no loose class.
     */
    public function isPending(string $folder): bool
    {
        return in_array($folder, $this->pending, true) && ! in_array($folder, $this->roles, true);
    }

    /**
     * @return list<string>
     */
    public static function coreRootFiles(): array
    {
        return self::CORE_ROOT_FILES;
    }

    private static function fromManifest(string $manifest, string $root): self
    {
        $rows = json_decode((string) file_get_contents($manifest), true, flags: JSON_THROW_ON_ERROR);
        $roles = [];
        $pending = [];

        foreach ($rows as $row) {
            if (str_starts_with($row['final_path'], $root) && substr_count(substr($row['final_path'], strlen($root)), '/') > 0) {
                $roles[] = explode('/', substr($row['final_path'], strlen($root)))[0];
            }

            if (in_array($row['status'], ['move', 'generate'], true) && str_starts_with($row['old_path'], $root) && substr_count(substr($row['old_path'], strlen($root)), '/') > 0) {
                $pending[] = explode('/', substr($row['old_path'], strlen($root)))[0];
            }
        }

        return new self(array_values(array_unique($roles)), array_values(array_unique($pending)));
    }
}
