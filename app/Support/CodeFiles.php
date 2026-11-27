<?php

declare(strict_types=1);

namespace App\Support;

use App\Exceptions\CodeReadOutsideProject;
use App\Exceptions\FileUnreadable;
use App\Files\ClosedFolders;
use App\Files\Enums\Place;
use App\Files\FolderWalker;
use App\Files\PathConfinement;
use App\Files\PlaceRoots;
use App\Files\Values\FolderEntries;
use App\Navigation\Exceptions\FileOutsidePlaces;
use App\Values\FilePath;
use Closure;
use Composer\InstalledVersions;
use Illuminate\Config\Repository;
use Illuminate\Container\Container;
use Illuminate\Foundation\Application;

/**
 * The project's own code as this process read it first: each folder listing and class file is read once and kept,
 * with no stat afterwards, because code cannot change while a process runs (Octane's watch restarts its workers).
 * It lives for the process, apart from any one application, so every boot in it takes the same answers.
 */
final class CodeFiles
{
    private static self|null $process = null;

    /**
     * The folder listings read, by pattern.
     *
     * @var array<string, FolderEntries>
     */
    private array $folders = [];

    /**
     * The class files read, by relative path.
     *
     * @var array<string, string>
     */
    private array $files = [];

    /**
     * How often each pattern or file was read from the disk.
     *
     * @var array<string, int>
     */
    private array $reads = [];

    private function __construct(
        private readonly string $projectRoot,
        private readonly PathConfinement $confinement,
        private readonly FolderWalker $walker,
    ) {}

    /**
     * The code reads of this process, over the base path bootstrap/app.php gave the application, or before the
     * application exists, the root package Composer installed; never derived from where this class sits.
     */
    public static function ofProcess(): self
    {
        return self::$process ??= self::over(self::applicationRoot());
    }

    private static function applicationRoot(): string
    {
        $container = Container::getInstance();

        if ($container instanceof Application) {
            return $container->basePath();
        }

        return self::composerRoot();
    }

    private static function composerRoot(): string
    {
        return (string) realpath(InstalledVersions::getRootPackage()['install_path']);
    }

    /**
     * Code reads over a project root of their own, kept by the object alone.
     */
    public static function over(string $projectRoot): self
    {
        $roots = new PlaceRoots(new Repository(['journal' => ['files' => ['places' => ['project' => $projectRoot]]]]));
        $closed = new ClosedFolders($roots);
        $confinement = new PathConfinement($roots, $closed);

        return new self(rtrim($projectRoot, '/'), $confinement, new FolderWalker($roots, $closed, $confinement));
    }

    /**
     * The project file path of an absolute path in this project's code, such as a folder a class names with __DIR__;
     * FileOutsidePlaces when it lies outside the project.
     */
    public function projectPathOf(string $absolutePath): FilePath
    {
        if (! str_starts_with($absolutePath, "{$this->projectRoot}/")) {
            throw FileOutsidePlaces::given();
        }

        return FilePath::in(Place::Project, substr($absolutePath, strlen($this->projectRoot) + 1));
    }

    /**
     * The entries a pattern names, one level per '*', listed from the disk once per process.
     */
    public function folder(FilePath $pattern): FolderEntries
    {
        $this->assertProject($pattern);

        return $this->folders[$pattern->relative] ??= $this->counted(
            $pattern,
            fn () => $this->walker->expand($pattern),
        );
    }

    /**
     * A file of the project's code, read from the disk once per process.
     */
    public function file(FilePath $file): string
    {
        $this->assertProject($file);

        return $this->files[$file->relative] ??= $this->counted($file, function () use ($file) {
            $bytes = @file_get_contents($this->confinement->resolved($file));

            if ($bytes === false) {
                throw FileUnreadable::at($file->label());
            }

            return $bytes;
        });
    }

    /**
     * The real path of a file or folder of the project's code, refused as the funnel refuses any path: a climb, a
     * closed folder or a link out of the project.
     */
    public function realPathOf(FilePath $path): string
    {
        $this->assertProject($path);

        return $this->confinement->resolved($path);
    }

    /**
     * How often this process read the pattern or file from the disk: once, however often it was asked.
     */
    public function readCount(FilePath $path): int
    {
        return $this->reads[$path->relative] ?? 0;
    }

    private function assertProject(FilePath $path): void
    {
        if ($path->place !== Place::Project) {
            throw CodeReadOutsideProject::for($path->place);
        }
    }

    /**
     * @template T
     *
     * @param  Closure(): T  $read
     * @return T
     */
    private function counted(FilePath $path, Closure $read): mixed
    {
        try {
            return $read();
        } finally {
            $this->reads[$path->relative] = $this->readCount($path) + 1;
        }
    }
}
