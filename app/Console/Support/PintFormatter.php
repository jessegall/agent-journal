<?php

declare(strict_types=1);

namespace App\Console\Support;

use App\Files\Contracts\Files;
use App\Files\Enums\Permissions;
use App\Files\Enums\Place;
use App\Files\Values\Depth;
use App\Values\FilePath;
use Illuminate\Process\Factory as ProcessFactory;

/**
 * A generated PHP source as Pint writes it, so a generator's check compares what it would write with the file on disk.
 */
final readonly class PintFormatter
{
    public function __construct(private ProcessFactory $processes, private Files $files) {}

    public function formatted(string $source): string
    {
        return $this->files->scratch(function (FilePath $scratch) use ($source) {
            $this->files->write($scratch, $source);

            $this->processes->newPendingProcess()->path(base_path())->run([
                'vendor/bin/pint',
                $this->files->realPath($scratch),
            ]);

            return $this->files->read($scratch);
        }, '.php');
    }

    /**
     * Each source as Pint formats it, by its key, all formatted in one run.
     *
     * @param  array<string, string>  $sources
     * @return array<string, string>
     */
    public function formattedAll(array $sources): array
    {
        $folder = FilePath::in(Place::Temporary, 'pint-'.bin2hex(random_bytes(6)));
        $this->files->makeFolder($folder, Permissions::Shared);
        $files = [];

        foreach (array_keys($sources) as $index => $key) {
            $files[$key] = $folder->child("{$index}.php");
            $this->files->write($files[$key], $sources[$key]);
        }

        try {
            $this->processes->newPendingProcess()->path(base_path())->run([
                'vendor/bin/pint',
                $this->files->realPath($folder),
            ]);

            return array_map(fn (FilePath $file) => $this->files->read($file), $files);
        } finally {
            $this->files->deleteFolder($folder, Depth::levels(Depth::LEVEL_LIMIT));
        }
    }

    /**
     * Formats the files written at these paths from the project root in place.
     *
     * @param  list<string>  $paths
     */
    public function formatInPlace(array $paths): void
    {
        $this->processes->newPendingProcess()->path(base_path())->run(['vendor/bin/pint', ...$paths]);
    }
}
