<?php

declare(strict_types=1);

namespace App\Files\Support;

use App\Files\Enums\Place;
use App\Files\Exceptions\CodeReadOutsideProject;
use App\Files\Exceptions\FileOutsidePlaces;
use App\Files\Exceptions\FileUnreadable;
use App\Files\Values\FilePath;
use App\Files\Values\FolderEntries;
use Closure;
use Illuminate\Config\Repository;

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
     * The code reads of this process, over the project this code lives in.
     */
    public static function ofProcess(): self
    {
        return self::$process ??= self::over(dirname(__DIR__, 3));
    }

    /**
     * Code reads over a project root of their own, kept by the object alone.
     */
    public static function over(string $projectRoot): self
    {
        $roots = new PlaceRoots(new Repository(['files' => ['places' => ['project' => $projectRoot]]]));
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
