<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Contracts\CommandHandler;
use App\Contracts\Event;
use App\Contracts\Listener;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Architecture\Support\DomainFiles;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Every class in an Events folder of Core, a domain or an installed module implements Core's Event marker, so what
 * happens is recognisable as an event (user message 2307); every class in a Listeners folder implements Listener and
 * every class in a Handlers folder implements CommandHandler (user message 3246), and neither marker is used outside
 * its
 * folder.
 */
#[TimeLimit(seconds: 15, reason: 'It parses the project files it judges.')]
final class EventMarkerTest extends TestCase
{
    /**
     * @return iterable<string, array{string, class-string}>
     */
    public static function markedFolders(): iterable
    {
        yield 'events' => ['/Events/', Event::class];
        yield 'listeners' => ['/Listeners/', Listener::class];
        yield 'handlers' => ['/Handlers/', CommandHandler::class];
    }

    /**
     * @param  class-string  $marker
     */
    #[DataProvider('markedFolders')]
    public function test_every_class_of_a_marked_folder_implements_its_marker_and_only_there(
        string $folder,
        string $marker,
    ): void {
        $unmarked = [];
        $misplaced = [];

        foreach (DomainFiles::in([app_path(), ...DomainFiles::domainCode(), base_path('tests/Fixtures/Modules')]) as $file) {
            $class = self::classIn($file);

            if ($class === null || interface_exists($class)) {
                continue;
            }

            $inFolder = str_contains($file, $folder);
            $marked = is_subclass_of($class, $marker);

            if ($inFolder && ! $marked) {
                $unmarked[] = $class;
            }

            if (! $inFolder && $marked && $marker !== Event::class) {
                $misplaced[] = $class;
            }
        }

        $this->assertSame([[], []], [$unmarked, $misplaced]);
    }

    private static function classIn(string $file): string|null
    {
        $source = (string) file_get_contents($file);

        if (preg_match('/^namespace ([^;]+);/m', $source, $namespace) !== 1 || preg_match('/^(?:final |abstract )?(?:readonly )?(?:class|interface|enum) (\w+)/m', $source, $name) !== 1) {
            return null;
        }

        return $namespace[1].'\\'.$name[1];
    }
}
