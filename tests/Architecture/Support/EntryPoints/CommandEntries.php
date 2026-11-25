<?php

declare(strict_types=1);

namespace Tests\Architecture\Support\EntryPoints;

use App\Support\CommandRegistry;

/**
 * Every command the booted journal registers, each with the one test file it has: for core's
 * tests/Commands/<Subject>/<Name>Test.php, for a domain's domain/<Domain>/tests/Commands/<Name>Test.php.
 */
final readonly class CommandEntries
{
    public function __construct(private CommandRegistry $registry) {}

    /**
     * @return list<EntryPoint>
     */
    public function entries(): array
    {
        return array_map(
            fn (string $command) => new EntryPoint(EntryType::Command, $command, self::testFileOf($command)),
            array_keys($this->registry->handlerMap()),
        );
    }

    private static function testFileOf(string $command): string
    {
        $parts = explode('\\', $command);
        $name = substr(end($parts), 0, -strlen('Command'));
        $folder = EntryPoint::folderOf($command, EntryType::Command);

        return $parts[0] === 'Domain' ? "{$folder}/{$name}Test.php" : "{$folder}/{$parts[2]}/{$name}Test.php";
    }
}
