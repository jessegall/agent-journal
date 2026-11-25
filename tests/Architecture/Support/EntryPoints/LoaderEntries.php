<?php

declare(strict_types=1);

namespace Tests\Architecture\Support\EntryPoints;

use App\Declarations\RegisteredLoader;
use App\Support\ClientDeclarations;
use App\Support\Web\AppContext;

/**
 * Every read a test is written for: the reader of each declared loader and each class of READ_ENTRIES, which builds
 * what every page reads, each tested in the reads folder of core or of its domain.
 */
final readonly class LoaderEntries
{
    /**
     * The classes that read for every page without being a loader's reader.
     *
     * @var list<class-string>
     */
    public const array READ_ENTRIES = [
        AppContext::class,
    ];

    public function __construct(private ClientDeclarations $declarations) {}

    /**
     * @return list<EntryPoint>
     */
    public function entries(): array
    {
        return array_map(self::entryOf(...), $this->readClasses());
    }

    /**
     * The read entry of one class, tested anywhere in the reads folder of core or of its domain.
     *
     * @param  class-string  $class
     */
    public static function entryOf(string $class): EntryPoint
    {
        return new EntryPoint(EntryType::Read, $class, EntryPoint::folderOf($class, EntryType::Read));
    }

    /**
     * The classes of every read: each declared loader's reader and the listed ones.
     *
     * @return list<class-string>
     */
    private function readClasses(): array
    {
        return array_values(array_unique([
            ...array_map(fn (RegisteredLoader $loader) => $loader->reader, $this->declarations->loaders()),
            ...self::READ_ENTRIES,
        ]));
    }
}
